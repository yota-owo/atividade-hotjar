const prisma = require("../src/config/database");

async function main() {
  console.log("🌱 Iniciando a Forja (Seed do Mighty Blade)...");

  // Upsert das Raças
  await prisma.raca.upsert({
    where: { nome: "Anão" },
    update: { inteligenciaBase: 3 },
    create: {
      id: "anao",
      nome: "Anão",
      forcaBase: 4,
      agilidadeBase: 2,
      inteligenciaBase: 3,
      vontadeBase: 3,
    },
  });

  await prisma.raca.upsert({
    where: { nome: "Elfo" },
    update: {},
    create: {
      id: "elfo",
      nome: "Elfo",
      forcaBase: 2,
      agilidadeBase: 4,
      inteligenciaBase: 3,
      vontadeBase: 3,
    },
  });

  // Upsert das Classes
  await prisma.classe.upsert({
    where: { nome: "Guerreiro" },
    update: { bonusVontade: 0 },
    create: {
      id: "guerreiro",
      nome: "Guerreiro",
      bonusForca: 1,
      bonusAgilidade: 1,
      bonusInteligencia: 0,
      bonusVontade: 0,
    },
  });

  await prisma.classe.upsert({
    where: { nome: "Feiticeiro" },
    update: {},
    create: {
      id: "feiticeiro",
      nome: "Feiticeiro",
      bonusForca: 0,
      bonusAgilidade: 0,
      bonusInteligencia: 1,
      bonusVontade: 1,
    },
  });

  console.log("✅ Raças e Classes forjadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
