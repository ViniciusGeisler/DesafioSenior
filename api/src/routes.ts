import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (request: Request, response: Response) => {
    return response.json({ 'message': 'bala' })
});

export default router