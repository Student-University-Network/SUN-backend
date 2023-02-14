import config from '@/config';
import log from '@/utils/logger';
import { db } from '@/utils/database';
import { Role } from '@prisma/client';
import argon2 from 'argon2';

async function seed() {
	// create admin user
	log.debug('Creating admin user...');
	const hashPassword = await argon2.hash(config.admin.password);
	const admin = await db.user.create({
		data: {
			firstName: 'Admin',
			lastName: 'User',
			role: Role.ADMIN,
			userLoginData: {
				create: {
					email: config.admin.email,
					password: hashPassword,
					username: config.admin.username,
				},
			},
		},
	});
	log.debug(admin);
}

seed()
	.then(async () => {
		await db.$disconnect();
	})

	.catch(async (e) => {
		console.error(e);

		await db.$disconnect();

		process.exit(1);
	});
