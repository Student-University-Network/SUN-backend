import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import {
	changePasswordInput,
	updateProfileInput,
} from '@/modules/user/user.schema';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/utils/database';
import log from '@/utils/logger';
import argon2 from 'argon2';

export async function getUserProfile(userId: string) {
	const userProfile = await db.profile.findUnique({
		where: {
			userId,
		},
	});

	return userProfile;
}

export async function updateUserProfile(
	userId: string,
	payload: updateProfileInput,
) {
	log.debug(userId);
	const createOrUpdateProfile = await db.profile.upsert({
		where: {
			userId,
		},
		create: {
			...payload,
			userId,
		},
		update: {
			...payload,
		},
	});

	return createOrUpdateProfile;
}

export async function updatePassword(
	userId: string,
	payload: changePasswordInput,
) {
	const isPasswordVerified = await verifyUserPassword(
		userId,
		payload.currentPassword,
	);

	if (!isPasswordVerified) {
		throw new ApiError(
			'Invalid Password',
			HttpStatusCode.BAD_REQUEST,
			'Password is incorrect',
		);
	}

	// all good here, hash & update the password
	log.debug('Hashing the password');
	const hashPassword = await argon2.hash(payload.newPassword);

	log.debug('Updating password');
	const updatePassword = await db.user.update({
		where: {
			id: userId,
		},
		data: {
			userLoginData: {
				update: {
					password: hashPassword,
				},
			},
		},
		select: {
			firstName: true,
		},
	});

	return updatePassword;
}

async function verifyUserPassword(userId: string, password: string) {
	// get user details
	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			userLoginData: true,
		},
	});

	if (!user)
		throw new ApiError(
			'BADREQUEST',
			HttpStatusCode.BAD_REQUEST,
			'BAD REQUEST',
		);

	log.debug('Verifying password');

	const verifyPassword = await argon2.verify(
		user.userLoginData.password,
		password,
	);

	return verifyPassword;
}
