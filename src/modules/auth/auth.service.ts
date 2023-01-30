import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { registerInput } from '@/modules/auth/auth.schema';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/utils/database';
import log from '@/utils/logger';
import argon2 from 'argon2';

export async function createUser({
	email,
	username,
	password,
	...rest
}: registerInput) {
	//
	log.info('Checking if user already exists');
	const userExists = await db.userLoginData.findUnique({
		where: {
			username,
		},
	});

	if (userExists) {
		throw new ApiError(
			'BAD REQUEST',
			HttpStatusCode.BAD_REQUEST,
			'User already exists with that username',
		);
	}

	log.info('Hashing the password');
	const hash = await argon2.hash(password);

	// Create record with hashed password
	log.info('Creating user record in the database');
	const user = await db.user.create({
		data: {
			...rest,
			userLoginData: {
				create: {
					email,
					username,
					password: hash,
				},
			},
		},
		select: {
			firstName: true,
			lastName: true,
			userLoginData: {
				select: {
					email: true,
					username: true,
				},
			},
		},
	});

	if (!user) {
		throw new ApiError(
			'BAD REQUEST',
			HttpStatusCode.BAD_REQUEST,
			'User cannot be created!',
		);
	}

	log.info('User created successfully!');

	return { ...user };
}
