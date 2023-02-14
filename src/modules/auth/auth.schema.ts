import { object, string, TypeOf, z } from 'zod';

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
	}),
});

export type registerInput = TypeOf<typeof registerSchema>['body'];
