import { db } from '../prisma/db.js';

const ESPORTES_PADRAO = [
  { id: 1, nome: 'Corrida' },
  { id: 2, nome: 'Musculação' },
  { id: 3, nome: 'Futebol' },
  { id: 4, nome: 'Bike' },
  { id: 5, nome: 'Outros' },
] as const;

type EsporteRow = Awaited<ReturnType<typeof db.orm.public.Esportes.create>>;

async function hasReferences(id: number) {
  const [atividades, publicacoes, anuncios, usuarioEsportes] = await Promise.all([
    db.orm.public.Eventos.first({ esporteId: id }),
    db.orm.public.Publicacoes.first({ esporteId: id }),
    db.orm.public.Anuncios.first({ esporteId: id }),
    db.orm.public.UsuarioEsportes.first({ esporteId: id }),
  ]);

  return Boolean(atividades || publicacoes || anuncios || usuarioEsportes);
}

async function seedEsportes() {
  const porNome = new Map<string, number>();

  for (const esporte of ESPORTES_PADRAO) {
    const existente = await db.orm.public.Esportes.first({ id: esporte.id });
    const mesmoNome = await db.orm.public.Esportes.first({
      nome: esporte.nome as EsporteRow['nome'],
    });

    if (mesmoNome && mesmoNome.id !== esporte.id) {
      throw new Error(
        `Não foi possível normalizar "${esporte.nome}": o nome já pertence ao ID ${mesmoNome.id}.`,
      );
    }

    if (existente) {
      if (existente.nome !== esporte.nome) {
        await db.orm.public.Esportes.where({ id: esporte.id }).update({
          nome: esporte.nome,
        });
      }
    } else {
      await db.orm.public.Esportes.create({
        id: esporte.id,
        nome: esporte.nome,
      });
    }

    porNome.set(esporte.nome, esporte.id);
  }

  const todos = await db.orm.public.Esportes.all();
  for (const esporte of todos) {
    if (porNome.has(esporte.nome) && porNome.get(esporte.nome) === esporte.id) {
      continue;
    }

    if (esporte.id <= 5) {
      throw new Error(`O ID ${esporte.id} não pôde ser normalizado.`);
    }

    if (await hasReferences(esporte.id)) {
      throw new Error(
        `O esporte extra "${esporte.nome}" (ID ${esporte.id}) possui referências e não pode ser removido automaticamente.`,
      );
    }

    await db.orm.public.Esportes.where({ id: esporte.id }).delete();
  }

  const resultado = await db.orm.public.Esportes.all();
  if (
    resultado.length !== ESPORTES_PADRAO.length ||
    resultado.some(
      (esporte) =>
        esporte.id < 1 ||
        esporte.id > ESPORTES_PADRAO.length ||
        esporte.nome !== ESPORTES_PADRAO[esporte.id - 1]?.nome,
    )
  ) {
    throw new Error('A normalização dos esportes não produziu o catálogo esperado.');
  }

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
