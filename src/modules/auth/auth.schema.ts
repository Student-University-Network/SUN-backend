import { Role } from '@prisma/client';
import { nativeEnum, object, string, TypeOf, z } from 'zod';

export const loginSchema = object({
	body: object({
		username: string({
			required_error: 'Username is required',
		}).min(3, 'Username is too short'),
		password: string({
			required_error: 'Password is required',
		}).min(4, 'Password should be minimum of 4 characters'),
	}),
});

export type loginInput = TypeOf<typeof loginSchema>['body'];

export const registerSchema = object({
	body: object({
		firstName: string({
			required_error: 'First name is required',
		}).min(3, 'First name is too short'),
		lastName: string({
			required_error: 'Last name is required',
		}),
		username: string().min(3, 'Username is too short'),
		password: string().min(6, 'Password should be minimum of 6 characters'),
		email: string().email().min(5, 'Enter a valid email'),
		role: nativeEnum(Role).default(Role.STUDENT).optional(),
		academicDetails: object({
			programId: string(),
			// batchId: string(),
		}).optional(),
	}),
});

export type registerInput = TypeOf<typeof registerSchema>['body'];

export const registerBatchSchema = object({
	body: object({
		users: z.array(
			z.object({
				firstName: string(),
				lastName: string(),
				email: string(),
				username: string().optional(),
				password: string().optional(),
				role: nativeEnum(Role).default(Role.STUDENT),
				programId: string().optional(),
				programName: string().optional(),
			}),
		),
	}),
});

export type registerBatchInput = TypeOf<typeof registerBatchSchema>['body'];

export interface UsersBatch {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
	role: string;
}
