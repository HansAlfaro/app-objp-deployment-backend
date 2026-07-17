import objetoService from '../services/objeto.js';

const findAll = async (req, res) => {
    try {
        const objetos = await objetoService.listar();
        return res.status(200).json(objetos);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const findOne = async (req, res) => {
    try {
        const objeto = await objetoService.obtener(req.params.id);
        if (!objeto) {
            return res.status(404).json({ success: false, message: 'No se ha encontrado el objeto.' });
        }
        return res.status(200).json(objeto);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { nombre, categoria, descripcion, icono, ubicacion } = req.body;
        const result = await objetoService.crear({ nombre, categoria, descripcion, icono, ubicacion });
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { nombre, categoria, descripcion, icono, ubicacion } = req.body;
        const result = await objetoService.actualizar(req.params.id, { nombre, categoria, descripcion, icono, ubicacion });
        return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const result = await objetoService.eliminar(req.params.id);
        return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const controller = { findAll, findOne, crear, actualizar, eliminar };

export default controller;