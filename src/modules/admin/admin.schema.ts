import { z } from 'zod';

export const GetUserDetailsSchema = z.object({
	params: z.object({
		userId: z.string(),
	}),
});

export type GetUserDetailsInput = z.TypeOf<
	typeof GetUserDetailsSchema
>['params'];

export const AssignProfessorSchema = z.object({
	body: z.object({
		courseId: z.string(),
		batchId: z.string(),
		teacherId: z.string(),
	}),
});

export type AssignProfessorInput = z.TypeOf<
	typeof AssignProfessorSchema
>['body'];
