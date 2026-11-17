import { OAuth2Client } from 'google-auth-library';
import { HttpError } from '../lib/http-error.js';

export type PerfilGoogle = {
  email: string;
  nome: string;
  sobrenome: string;
  foto: string | null;
};

// Variáveis do .env do backend (NUNCA vão para o front nem para o GitHub):
//   GOOGLE_CLIENT_ID=...
//   GOOGLE_CLIENT_SECRET=...
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

/**
 * Troca o "code" que o front recebeu do Google pela identidade da pessoa
 * e confere com o Google se ela é verdadeira.
 *
 * "postmessage" é o redirect_uri usado pelo login em janela (popup)
 * do front com flow: 'auth-code'.
 */
export const verificarCodigoGoogle = async (code: string): Promise<PerfilGoogle> => {
  if (!clientId || !clientSecret) {
    throw new HttpError(500, 'Login com Google não está configurado no servidor.');
  }

  const client = new OAuth2Client(clientId, clientSecret, 'postmessage');

  let idToken: string | null | undefined;
  try {
    const { tokens } = await client.getToken(code);
    idToken = tokens.id_token;
  } catch {
    throw new HttpError(401, 'Código do Google inválido ou expirado.');
  }

  if (!idToken) {
    throw new HttpError(401, 'O Google não retornou a identidade do usuário.');
  }

  // Confere assinatura, validade e se o token foi emitido para o NOSSO app.
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    throw new HttpError(401, 'O e-mail da conta Google não está verificado.');
  }

  const partes = (payload.name ?? '').trim().split(/\s+/).filter(Boolean);

  return {
    email: payload.email.toLowerCase(),
    nome: payload.given_name ?? partes[0] ?? payload.email.split('@')[0],
    sobrenome: payload.family_name ?? partes.slice(1).join(' '),
    foto: payload.picture ?? null
  };
};