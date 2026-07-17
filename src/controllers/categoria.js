import categoriaService from '../services/categoria.js';

const findAll = async (req, res) => {
    try {
        const categorias = await categoriaService.listar();
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { nombre } = req.body;
        const result = await categoriaService.crear({ nombre });
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const result = await categoriaService.eliminar(req.params.id);
        return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const controller = { findAll, crear, eliminar };

export default controller;