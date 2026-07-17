import express from 'express';
import controller from '../controllers/reclamo.js';
import authMiddleware, { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

const bloquearAdmin = (req, res, next) => {
    if (req.usuario?.rol === 'admin') {
        return res.status(403).json({
            success: false,
            message: 'El administrador no puede enviar reclamos.'
        });
    }
    next();
};

router.get('/', adminMiddleware, controller.listarPendientes);
router.get('/mios', bloquearAdmin, controller.listarMios);
router.post('/', bloquearAdmin, controller.crear);
router.put('/:id/resolver', adminMiddleware, controller.resolver);

export default router;
