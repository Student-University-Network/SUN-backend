import { z } from 'zod';

export const GetUserDetailsSchema = z.object({
	params: z.object({
		userId: z.string(),
	}),
});

export type GetUserDetailsInput = z.TypeOf<
	typeof GetUserDetailsSchema
>['params'];
