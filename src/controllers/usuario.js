import usuarioService from '../services/usuario.js';

const registrar = async (req, res) => {
    try {
        const { codigo, nombre, password, rol } = req.body;
        const response = await usuarioService.registrar({ codigo, nombre, password, rol });
        return res.status(response.success ? 201 : 400).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { codigo, password, rol } = req.body;
        const result = await usuarioService.login({ codigo, password, rol });
        return res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const toggleAcceso = async (req, res) => {
    try {
        const result = await usuarioService.toggleAcceso(req.params.id);
        return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error inesperado', error: error.message });
    }
};

const controller = { registrar, login, listarUsuarios, toggleAcceso };

export default controller;
