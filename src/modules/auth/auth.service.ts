import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import {
	loginInput,
	registerBatchInput,
	registerInput,
	UsersBatch,
} from '@/modules/auth/auth.schema';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/utils/database';
import log from '@/utils/logger';
import argon2 from 'argon2';
import config from '@/config';
import jwt from 'jsonwebtoken';
import { Role, User } from '@prisma/client';
import { parseCSV, toCSV } from '@/utils/fileUploads';

export async function createUser({
	email,
	username,
	password,
	firstName,
	lastName,
	role = Role.STUDENT,
	academicDetails,
	...rest
}: registerInput) {
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
	const hash = await argon2.hash(password);

	const user = await db.user.create({
		data: await createNewUserObject(
			firstName,
			lastName,
			username,
			email,
			hash,
			role,
			academicDetails?.programId || '',
			{},
			db,
		),
		select: {
			role: true,
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
	return { ...user };
}

export async function createBatchUsers(body: registerBatchInput) {
	const users = body.users.map((row) => {
		return {
			...row,
			username:
				row.username ||
				row.firstName + row.lastName + Math.round(Math.random() * 1e3),
			password:
				row.password ||
				row.firstName + '@' + Math.round(Math.random() * 1e4),
		};
	});
	await db.$transaction(async (tx) => {
		for (const usr of users) {
			const role: string = usr.role;
			await tx.user.create({
				data: await createNewUserObject(
					usr.firstName,
					usr.lastName,
					usr.username,
					usr.email,
					await argon2.hash(usr.password),
					Role[role as keyof typeof Role],
					usr.programId || '',
					{},
					tx,
				),
			});
		}
	});
	return toCSV(
		[
			['firstName', 'lastName', 'email', 'role', 'username', 'password'],
			['string', 'string', 'string', 'string', 'string', 'string'],
		],
		users,
		',',
	);
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

async function createNewUserObject(
	firstName: string,
	lastName: string,
	username: string,
	email: string,
	hash: string,
	role: Role,
	programId: string,
	rest: any,
	dbc: any,
) {
	let normalData = {
		...rest,
		role,
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
	};
	if (programId && programId !== '') {
		return {
			...normalData,
			academicDetails: {
				create: {
					program: {
						connect: { programId },
					},
				},
			},
		};
	} else {
		return { ...normalData };
	}
}
