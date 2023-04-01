import { db } from '@/utils/database';

export async function getUsersList() {
	const usersList = await db.user.findMany({
		select: {
			id: true,
			role: true,
			userLoginData: {
				select: {
					username: true,
				},
			},
			profile: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
		},
	});
	return {
		users: usersList.map((user) => {
			return {
				id: user.id,
				role: user.role,
				username: user.userLoginData.username,
				firstName: user.profile?.firstName || '',
				lastName: user.profile?.lastName || '',
			};
		}),
	};
}

export async function getUserDetails(userId: string) {
	// TODO : add Faculty and students role handling
	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			profile: true,
			academicDetails: true,
		},
	});

	return user;
}
