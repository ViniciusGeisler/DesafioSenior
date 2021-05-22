import { Router } from 'express';
import MaterialController from './controller/MaterialController';
import SolicitationController from './controller/SolicitationController';

const router = Router();

const materialController = new MaterialController();
const solicitationController = new SolicitationController();

router.post('/material', materialController.create)
router.get('/material',  materialController.index)
router.get('/material/:code',  materialController.findByCode)
router.put('/material/:codeFromUrl', materialController.update)
router.delete('/material/:code', materialController.delete)

router.post('/solicitation', solicitationController.create)
router.get('/solicitation',  solicitationController.index)
router.get('/solicitation/:solicitationNumber',  solicitationController.findBySolicitationNumber)
router.put('/solicitation/:solicitationNumberFromUrl', solicitationController.update)
router.delete('/solicitation/:solicitationNumber', solicitationController.delete)

export default router