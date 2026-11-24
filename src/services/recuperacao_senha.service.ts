import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';
import { updateUsuario } from './usuarios.service.js';
import { enviarCodigoRecuperacao } from './email.service.js';

type UsuarioRow = Awaited<ReturnType<typeof db.orm.public.Usuarios.create>>;

const VALIDADE = '15m';
const ERRO_CODIGO = 'Código inválido ou expirado.';

// Chave própria para este fluxo. Diferente da chave do login, então um token de
// recuperação nunca é aceito como token de sessão.
function chave() {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) throw new HttpError(500, 'Servidor sem JWT_SECRET configurado.');
  return `${segredo}:recuperacao-senha`;
}

// Muda quando a senha muda, então o código deixa de valer depois de usado.
const impressaoDaSenha = (senhaHash: string) =>
  crypto.createHash('sha256').update(senhaHash).digest('hex').slice(0, 24);

// Só quem conhece a chave do servidor consegue gerar isto, então o código de
// 6 dígitos não pode ser descoberto olhando o token.
const prova = (userId: string, codigo: string, impressao: string) =>
  crypto.createHmac('sha256', chave()).update(`${userId}:${codigo}:${impressao}`).digest('hex');

async function buscarPorEmail(email: string) {
  return db.orm.public.Usuarios.first({ email: email as UsuarioRow['email'] });
}

/**
 * Passo 1: gera o código, envia por e-mail e devolve um token.
 * A resposta é igual exista a conta ou não, para ninguém descobrir quem tem conta.
 */
export async function solicitarRecuperacao(email: string) {
  const usuario = await buscarPorEmail(email);

  // Diagnóstico temporário: remova depois que o e-mail estiver funcionando.
  console.log(
    '[recuperação] e-mail:', email,
    '| conta encontrada:', Boolean(usuario),
    '| tem senha:', Boolean(usuario?.senhaHash),
  );

  const codigo = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');

  let sub = '0';
  let impressao = 'sem-conta';

  if (usuario && usuario.senhaHash) {
    sub = String(usuario.id);
    impressao = impressaoDaSenha(String(usuario.senhaHash));

    // Não espera o envio, para a resposta ter o mesmo tempo nos dois casos.
    void enviarCodigoRecuperacao(email, codigo).catch((error) => {
      console.error('Falha ao enviar e-mail de recuperação:', error);
    });
  }

  const token = jwt.sign({ sub, p: prova(sub, codigo, impressao) }, chave(), {
    expiresIn: VALIDADE,
  });

  return { token };
}

/**
 * Passo 2: confere o código e troca a senha.
 */
export async function redefinirSenha(input: {
  email: string;
  token: string;
  codigo: string;
  novaSenha: string;
}) {
  let payload: { sub: string; p: string };
  try {
    payload = jwt.verify(input.token, chave()) as { sub: string; p: string };
  } catch {
    throw new HttpError(400, ERRO_CODIGO);
  }

  const usuario = await buscarPorEmail(input.email);
  if (!usuario || !usuario.senhaHash || String(usuario.id) !== payload.sub) {
    throw new HttpError(400, ERRO_CODIGO);
  }

  const esperado = Buffer.from(
    prova(payload.sub, input.codigo, impressaoDaSenha(String(usuario.senhaHash))),
    'hex',
  );
  const recebido = Buffer.from(payload.p, 'hex');

  if (esperado.length !== recebido.length || !crypto.timingSafeEqual(esperado, recebido)) {
    throw new HttpError(400, ERRO_CODIGO);
  }

  // updateUsuario já gera o hash da senha com bcrypt.
  await updateUsuario(Number(usuario.id), { senha: input.novaSenha });
}