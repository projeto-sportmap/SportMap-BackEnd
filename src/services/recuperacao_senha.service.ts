
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';
import { updateUsuario } from './usuarios.service.js';
import { enviarCodigoRecuperacao } from './email.service.js';

type UsuarioRow = Awaited<
  ReturnType<typeof db.orm.public.Usuarios.create>
>;

type TokenRecuperacao = {
  sub: string;
  p: string;
  jti: string;
};

const VALIDADE = '5m';
const ERRO_CODIGO = 'Código inválido ou expirado.';

const INTERVALO_REENVIO = 60 * 1000;

// Guarda o último token válido de cada e-mail.
const tokensAtivos = new Map<string, string>();

// Guarda o horário da última solicitação de cada e-mail.
const ultimosReenvios = new Map<string, number>();

// Chave própria para recuperação de senha.
function chave() {
  const segredo = process.env.JWT_SECRET;

  if (!segredo) {
    throw new HttpError(
      500,
      'Servidor sem JWT_SECRET configurado.'
    );
  }

  return `${segredo}:recuperacao-senha`;
}

// Identifica a senha atual do usuário.
const impressaoDaSenha = (senhaHash: string) =>
  crypto
    .createHash('sha256')
    .update(senhaHash)
    .digest('hex')
    .slice(0, 24);

// Gera a prova criptográfica do código.
const prova = (
  userId: string,
  codigo: string,
  impressao: string
) =>
  crypto
    .createHmac('sha256', chave())
    .update(`${userId}:${codigo}:${impressao}`)
    .digest('hex');

// Busca usuário pelo e-mail.
async function buscarPorEmail(email: string) {
  return db.orm.public.Usuarios.first({
    email: email as UsuarioRow['email'],
  });
}

/**
 * Gera um novo código e token de recuperação.
 */
async function emitirCodigo(email: string) {
  const usuario = await buscarPorEmail(email);

  const codigo = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');

  let sub = '0';
  let impressao = 'sem-conta';

  if (usuario && usuario.senhaHash) {
    sub = String(usuario.id);

    // Não espera o envio, para a resposta ter o mesmo tempo nos dois casos.
    try {
      await enviarCodigoRecuperacao(email, codigo);
    } catch (error) {
      console.error("Recovery email delivery failed:", error);
      throw new HttpError(503, "Não foi possível enviar o código agora. Tente novamente mais tarde.");
    }
  }

  // Identificador único para cada solicitação.
  const jti = crypto.randomUUID();

  const token = jwt.sign(
    {
      sub,
      p: prova(sub, codigo, impressao),
      jti,
    },
    chave(),
    {
      expiresIn: VALIDADE,
    }
  );

  // O novo token substitui o anterior.
  tokensAtivos.set(email, jti);

  return { token };
}

/**
 * Controla o intervalo entre todas as solicitações.
 * Vale tanto para o primeiro código quanto para os reenvios.
 */
async function solicitarCodigoComIntervalo(email: string) {
  const emailNormalizado = email.trim().toLowerCase();

  const agora = Date.now();

  const ultimoReenvio =
    ultimosReenvios.get(emailNormalizado);

  if (ultimoReenvio !== undefined) {
    const tempoDecorrido = agora - ultimoReenvio;

    if (tempoDecorrido < INTERVALO_REENVIO) {
      const segundosRestantes = Math.ceil(
        (INTERVALO_REENVIO - tempoDecorrido) / 1000
      );

      throw new HttpError(
        429,
        `Aguarde ${segundosRestantes} segundos para solicitar outro código.`
      );
    }
  }

  // Reserva o intervalo antes da operação assíncrona.
  // Isso evita que duas solicitações simultâneas passem pela verificação.
  ultimosReenvios.set(emailNormalizado, agora);

  try {
    return await emitirCodigo(emailNormalizado);
  } catch (error) {
    // Se a emissão falhar, libera o intervalo para uma nova tentativa.
    if (ultimosReenvios.get(emailNormalizado) === agora) {
      ultimosReenvios.delete(emailNormalizado);
    }

    throw error;
  }
}

/**
 * PASSO 1:
 * Solicita o primeiro código de recuperação.
 */
export async function solicitarRecuperacao(email: string) {
  return solicitarCodigoComIntervalo(email);
}

/**
 * PASSO 2:
 * Reenvia o código de recuperação.
 * Permite uma solicitação a cada 60 segundos.
 */
export async function reenviarCodigo(email: string) {
  return solicitarCodigoComIntervalo(email);
}

/**
 * PASSO 3:
 * Confere o código e altera a senha.
 */
export async function redefinirSenha(input: {
  email: string;
  token: string;
  codigo: string;
  novaSenha: string;
}) {
  const emailNormalizado = input.email
    .trim()
    .toLowerCase();

  let payload: TokenRecuperacao;

  try {
    payload = jwt.verify(
      input.token,
      chave()
    ) as TokenRecuperacao;
  } catch {
    throw new HttpError(400, ERRO_CODIGO);
  }

  // Verifica se o token é o último emitido.
  const tokenAtivo = tokensAtivos.get(emailNormalizado);

  if (
    !payload.jti ||
    !tokenAtivo ||
    tokenAtivo !== payload.jti
  ) {
    throw new HttpError(400, ERRO_CODIGO);
  }

  const usuario = await buscarPorEmail(emailNormalizado);

  if (
    !usuario ||
    !usuario.senhaHash ||
    String(usuario.id) !== payload.sub
  ) {
    throw new HttpError(400, ERRO_CODIGO);
  }

  const esperado = Buffer.from(
    prova(
      payload.sub,
      input.codigo,
      impressaoDaSenha(String(usuario.senhaHash))
    ),
    'hex'
  );

  const recebido = Buffer.from(payload.p, 'hex');

  if (
    esperado.length !== recebido.length ||
    !crypto.timingSafeEqual(esperado, recebido)
  ) {
    throw new HttpError(400, ERRO_CODIGO);
  }

  // Atualiza a senha usando o serviço existente.
  await updateUsuario(
    Number(usuario.id),
    {
      senha: input.novaSenha,
    }
  );

  // Invalida o token depois de utilizar.
  tokensAtivos.delete(emailNormalizado);

  // Limpa o controle de reenvio.
  ultimosReenvios.delete(emailNormalizado);
}
