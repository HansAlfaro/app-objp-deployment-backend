import reclamoService from '../services/reclamo.js';

const listarPendientes = async (req, res) => {
    try {
        const reclamos = await reclamoService.listarPendientes();
        return res.status(200).json(reclamos);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const listarMios = async (req, res) => {
    try {
        const reclamos = await reclamoService.listarPorUsuario(req.usuario.id);
        return res.status(200).json(reclamos);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { objetoId, evidencia } = req.body;
        const result = await reclamoService.crear(req.usuario.id, { objetoId, evidencia });
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const resolver = async (req, res) => {
    try {
        const { aprobado, motivoRechazo } = req.body;
        const result = await reclamoService.resolver(req.params.id, Boolean(aprobado), motivoRechazo);
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const controller = { listarPendientes, listarMios, crear, resolver };

export default controller;