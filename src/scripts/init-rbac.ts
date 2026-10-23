// Arquivo: src/scripts/init-rbac.ts
import { db } from '../prisma/db.js';

type TipoRow = Awaited<ReturnType<typeof db.orm.public.TipoUsuario.create>>;

try {
  const types = [
    { id: 1, code: 'USUARIO', name: 'Usuario Comum' },
    { id: 2, code: 'ADMIN', name: 'Administração' },
  ];
  for (const type of types) {
    const byId = await db.orm.public.TipoUsuario.first({ id: type.id });
    const byCode = await db.orm.public.TipoUsuario.first({ code: type.code as TipoRow['code'] });
    if ((byId && byId.code !== type.code) || (byCode && byCode.id !== type.id)) {
      throw new Error('Catálogo de tipos conflitante. Revise os IDs antes de continuar.');
    }
    if (!byId) {
      await db.orm.public.TipoUsuario.create({
        id: type.id,
        code: type.code as TipoRow['code'],
        name: type.name as TipoRow['name'],
      });
    }
  }
  let updated = 0;
  for (const usuario of await db.orm.public.Usuarios.all()) {
    if (usuario.tipoUsuarioId === null) {
      await db.orm.public.Usuarios.where({ id: usuario.id }).update({ tipoUsuarioId: 1 });
      updated++;
    }
  }
  console.log(`Tipos preparados; ${updated} conta(s) antiga(s) vinculada(s) a USUARIO.`);
} finally {
  await db.close();
}