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

export const getBatchSchema = z.object({
	params: z.object({
		batchId: z.string(),
	}),
});

export type getBatchInput = z.TypeOf<typeof getBatchSchema>['params'];

export const SaveBatchDetailsSchema = z.object({
	body: z.object({
		id: z.string(),
		batchName: z.string(),
		students: z.array(
			z.object({
				id: z.string(),
				firstName: z.string(),
				lastName: z.string(),
			}),
		),
		unassignedStudents: z.array(
			z.object({
				id: z.string(),
				firstName: z.string(),
				lastName: z.string(),
			}),
		),
		courses: z.array(
			z.object({
				courseId: z.string(),
				courseName: z.string(),
				professor: z.object({
					id: z.string(),
					firstName: z.string(),
					lastName: z.string(),
				}),
			}),
		),
	}),
});

export type saveBatchDetailsInput = z.TypeOf<
	typeof SaveBatchDetailsSchema
>['body'];
