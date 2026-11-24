// Envia o código de recuperação de senha.
//
// Escolhe sozinho como enviar, nesta ordem:
//
//  1. RESEND_FROM + RESEND_API_KEY  -> Resend com domínio verificado (envia para qualquer pessoa)
//  2. SMTP_USER + SMTP_PASS         -> Gmail com senha de app (grátis, envia para qualquer pessoa)
//  3. RESEND_API_KEY (sem domínio)  -> Resend em modo teste (só entrega no e-mail da conta do Resend)
//  4. Nada configurado              -> mostra o código no terminal (só fora de produção)

const ASSUNTO = 'Seu código de recuperação de senha';

const texto = (codigo: string) =>
  `Seu código de recuperação é ${codigo}. Ele vale por 15 minutos. Se não foi você, ignore este e-mail.`;

const html = (codigo: string) => `
  <div style="font-family:Arial,sans-serif;max-width:420px">
    <h2>Recuperação de senha</h2>
    <p>Use o código abaixo para criar uma nova senha:</p>
    <p style="font-size:32px;letter-spacing:6px;font-weight:bold">${codigo}</p>
    <p>Ele vale por 15 minutos. Se não foi você, ignore este e-mail.</p>
  </div>
`;

async function enviarPeloResend(para: string, codigo: string, from: string) {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: [para],
    subject: ASSUNTO,
    text: texto(codigo),
    html: html(codigo),
  });

  // O Resend não lança erro: devolve { error } quando algo dá errado.
  if (error) throw new Error(`Resend: ${error.message}`);

  console.log('[email] enviado pelo Resend para', para, '| id:', data?.id);
}

async function enviarPeloGmail(para: string, codigo: string) {
  const { SMTP_USER, SMTP_PASS } = process.env;
  const nodemailer = await import('nodemailer');

  const transporter = nodemailer.default.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"SportMap" <${SMTP_USER}>`,
    to: para,
    subject: ASSUNTO,
    text: texto(codigo),
    html: html(codigo),
  });

  console.log('[email] enviado pelo Gmail para', para);
}

export async function enviarCodigoRecuperacao(para: string, codigo: string) {
  const { RESEND_API_KEY, RESEND_FROM, SMTP_USER, SMTP_PASS, NODE_ENV } = process.env;

  // 1. Resend com domínio verificado
  if (RESEND_API_KEY && RESEND_FROM) {
    return enviarPeloResend(para, codigo, RESEND_FROM);
  }

  // 2. Gmail (grátis, funciona para qualquer destinatário)
  if (SMTP_USER && SMTP_PASS) {
    return enviarPeloGmail(para, codigo);
  }

  // 3. Resend em modo teste (só entrega no e-mail da conta do Resend)
  if (RESEND_API_KEY) {
    return enviarPeloResend(para, codigo, 'SportMap <onboarding@resend.dev>');
  }

  // 4. Nada configurado
  if (NODE_ENV !== 'production') {
    console.log(`[recuperação de senha] código para ${para}: ${codigo}`);
    return;
  }

  throw new Error('Nenhum serviço de e-mail configurado.');
}