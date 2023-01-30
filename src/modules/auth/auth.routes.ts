import { Router, Request, Response } from 'express';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
	res.send({
		message: 'OK',
	});
});

export default router;
