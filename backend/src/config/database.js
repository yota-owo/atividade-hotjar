const { PrismaClient } = require("@prisma/client");

/**
 * ============================================================================
 * ENTREGÁVEL: DESIGN DE SOFTWARE - CÓDIGO ANOTADO
 * PADRÃO APLICADO: SINGLETON (Padrão Criacional)
 * * Justificativa: Em aplicações Node.js, instanciar o PrismaClient múltiplas
 * vezes (ex: em cada controller) esgota o pool de conexões do PostgreSQL.
 * O padrão Singleton garante que a aplicação inteira compartilhe uma
 * ÚNICA instância do PrismaClient durante todo o ciclo de vida do servidor,
 * otimizando o consumo de memória e conexões.
 * ============================================================================
 */

class Database {
  constructor() {
    if (!Database.instance) {
      this.prisma = new PrismaClient();
      Database.instance = this;
      console.log("📦 [Singleton] Nova instância do banco de dados criada.");
    }
    return Database.instance;
  }

  getClient() {
    return this.prisma;
  }
}

const dbInstance = new Database();
module.exports = dbInstance.getClient();
