import express from 'express';
import controller from '../controllers/objeto.js';
import authMiddleware, { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', authMiddleware, adminMiddleware, controller.crear);
router.put('/:id', authMiddleware, adminMiddleware, controller.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, controller.eliminar);

export default router;
