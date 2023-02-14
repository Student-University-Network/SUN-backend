import { Gender } from '@prisma/client';
import { date, nativeEnum, object, string, TypeOf, z } from 'zod';

export const updateProfileSchema = object({
	body: object({
		gender: nativeEnum(Gender).optional(),
		middleName: string().min(3, 'Middlename too short').optional(),
		dateOfBirth: date().optional(),
	}),
});

export type updateProfileInput = TypeOf<typeof updateProfileSchema>['body'];
