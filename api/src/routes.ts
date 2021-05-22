import { Request, Response, Router } from 'express';
import MaterialController from './controller/MaterialController';

const router = Router();

const materialController = new MaterialController();

router.post('/material', materialController.create),
router.get('/material',  materialController.index),
router.get('/material/:code',  materialController.findByCode),
router.put('/material/:codeFromUrl', materialController.update),
router.delete('/material/:code', materialController.delete)


export default router