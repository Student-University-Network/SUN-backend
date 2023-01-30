import { PrismaClient } from '@prisma/client';

let db: PrismaClient;
// always make sure to use existing prisma client if it exists already
declare global {
	var __db: PrismaClient | undefined;
}

if (!global.__db) {
	global.__db = new PrismaClient();
}

db = global.__db;

export { db };
