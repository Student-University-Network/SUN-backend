import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { loginInput, registerInput } from '@/modules/auth/auth.schema';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/utils/database';
import log from '@/utils/logger';
import argon2 from 'argon2';
import config from '@/config';
import jwt from 'jsonwebtoken';
import { Role, User } from '@prisma/client';

export async function createUser({
	email,
	username,
	password,
	firstName,
	lastName,
	...rest
}: registerInput) {
	//
	log.debug('Checking if user already exists');
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

	log.debug('Hashing the password');
	const hash = await argon2.hash(password);

	// Create record with hashed password
	log.debug('Creating user record in the database');
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
			profile: {
				create: {
					firstName,
					lastName,
				},
			},
		},
		select: {
			userLoginData: {
				select: {
					email: true,
					username: true,
				},
			},
			profile: true,
		},
	});

	if (!user) {
		throw new ApiError(
			'BAD REQUEST',
			HttpStatusCode.BAD_REQUEST,
			'User cannot be created!',
		);
	}

	log.debug('User created successfully!');

	return { ...user };
}

export async function login({ username, password }: loginInput) {
	log.debug('Check if the user exists');
	const userExists = await db.userLoginData.findUnique({
		where: {
			username,
		},
		select: {
			username: true,
			password: true,
			User: {
				include: {
					profile: true,
				},
			},
		},
	});

	if (!userExists || !userExists.User) {
		throw new ApiError(
			'UNAUTHORIZED',
			HttpStatusCode.UNAUTHORIZED,
			'Username or password is incorrect', // Not a good idea to tell the user what exactly is incorrect
		);
	}
	log.debug('Verifying password');
	const isVerified = await argon2.verify(userExists.password, password);

	if (!isVerified) {
		throw new ApiError(
			'BAD REQUEST',
			HttpStatusCode.BAD_REQUEST,
			'Username or password is incorrect',
		);
	}
	// all good
	// generate accesToken, refreshToken and return
	const payload: JWTPayload = {
		User: {
			id: userExists.User.id,
			createdAt: userExists.User.createdAt,
			updatedAt: userExists.User.updatedAt,
			username: userExists.username,
			firstName: userExists.User.profile?.firstName || '',
			lastName: userExists.User.profile?.lastName || '',
			role: userExists.User.role,
		},
	};
	const accessToken = await generateJWT(payload, 'accessToken');
	const refreshToken = await generateJWT(payload, 'refreshToken');

	return {
		username: userExists.username,
		accessToken,
		refreshToken,
	};
	// TODO: save the per device session somewhere
}

export type JWTPayload = {
	User: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		username: string;
		firstName: string;
		lastName: string;
		role: Role;
	};
};

async function generateJWT(payload: JWTPayload, type: string) {
	log.debug('Signing jwt for user %s', payload.User.username);

	return await jwt.sign(
		payload,
		type === 'accessToken'
			? config.secrets.accessToken
			: config.secrets.refreshToken,
		{
			expiresIn:
				type === 'accessToken'
					? config.secrets.accessTokenExpiry
					: '1d',
		},
	);
}

export async function generateAccessToken(token: string) {
	try {
		const valid = jwt.verify(token, config.secrets.refreshToken);
		const isValid = valid as JWTPayload;

		if (!isValid) return undefined;

		const payload = {
			User: isValid.User,
		};
		const accessToken = await generateJWT(payload, 'accessToken');

		return accessToken;
	} catch (e: any) {
		return undefined;
	}
}
