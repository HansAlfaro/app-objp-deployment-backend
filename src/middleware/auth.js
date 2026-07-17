import usuarioRepo from '../repositories/usuario.js';


const authMiddleware = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No se envió identificación de usuario.'
            });
        }

        const usuario = await usuarioRepo.findOne(userId);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        if (!usuario.activo) {
            return res.status(403).json({
                success: false,
                message: 'Tu cuenta se encuentra bloqueada. Contacta al administrador.'
            });
        }

        req.usuario = usuario.get ? usuario.get({ plain: true }) : usuario;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'No se pudo identificar al usuario.'
        });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.usuario?.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso restringido a administradores.'
        });
    }
    next();
};

export default authMiddleware;