import express from 'express';
import controller from '../controllers/categoria.js';
import authMiddleware, { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Público: cualquier usuario (alumno o admin) necesita ver las categorías
// disponibles para poder filtrar/publicar objetos.
router.get('/', controller.findAll);

// Solo el admin puede crear o eliminar categorías nuevas.
router.post('/', authMiddleware, adminMiddleware, controller.crear);
router.delete('/:id', authMiddleware, adminMiddleware, controller.eliminar);

export default router;