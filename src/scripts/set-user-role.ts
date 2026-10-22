// Arquivo: src/scripts/set-user-role.ts
import { db } from '../prisma/db.js';

type TipoRow = Awaited<ReturnType<typeof db.orm.public.TipoUsuario.create>>;
type UsuarioRow = Awaited<ReturnType<typeof db.orm.public.Usuarios.create>>;

try {
  const [emailArg, code, ...extra] = process.argv.slice(2);
  if (!emailArg || (code !== 'USUARIO' && code !== 'ADMIN') || extra.length > 0) {
    throw new Error('Uso: npx tsx src/scripts/set-user-role.ts email USUARIO|ADMIN');
  }
  const usuario = await db.orm.public.Usuarios.first({
    email: emailArg.trim().toLowerCase() as UsuarioRow['email'],
  });
  const tipo = await db.orm.public.TipoUsuario.first({ code: code as TipoRow['code'] });
  if (!usuario || !tipo) throw new Error('Conta ou tipo inexistente. Confira o cadastro e o init-rbac.');
  await db.orm.public.Usuarios.where({ id: usuario.id }).update({ tipoUsuarioId: tipo.id });
  console.log(`Conta ${usuario.id}: tipo alterado para ${code}.`);
} finally {
  await db.close();
}