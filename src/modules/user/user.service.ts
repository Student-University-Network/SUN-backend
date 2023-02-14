import { updateProfileInput } from '@/modules/user/user.schema';
import { db } from '@/utils/database';
import log from '@/utils/logger';

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
