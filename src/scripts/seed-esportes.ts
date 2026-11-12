import { db } from '../prisma/db.js';

const ESPORTES_DO_MAPA = ['Corrida', 'Musculação', 'Futebol', 'Bike', 'Outros'];

function normalizarNome(nome: string) {
  return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

async function seedEsportes() {
  const existentes = await db.orm.public.Esportes.all();
  const nomesExistentes = new Set(existentes.map((esporte) => normalizarNome(esporte.nome)));

  for (const nome of ESPORTES_DO_MAPA) {
    if (nomesExistentes.has(normalizarNome(nome))) continue;

    await db.orm.public.Esportes.create({ nome });
    nomesExistentes.add(normalizarNome(nome));
  }

  const resultado = await db.orm.public.Esportes.all();
  console.log(
    resultado
      .sort((a, b) => a.id - b.id)
      .map((esporte) => `${esporte.id}: ${esporte.nome}`)
      .join('\n'),
  );
}

try {
  await seedEsportes();
} finally {
  await db.close();
}
