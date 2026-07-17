import repository from '../repositories/usuario.js';
import reclamoRepo from '../repositories/reclamo.js';

const ROLES_VALIDOS = ['admin', 'student'];

const sanitize = (usuario) => {
    const plain = usuario.get ? usuario.get({ plain: true }) : usuario;
    const { password, ...rest } = plain;
    return rest;
};

const registrar = async ({ codigo, nombre, password, rol }) => {
    if (!codigo || !nombre || !password) {
        return { success: false, message: 'Proporcione código, nombre y password.' };
    }

    const rolFinal = ROLES_VALIDOS.includes(rol) ? rol : 'student';

    if (await repository.findByCodigo(codigo)) {
        return { success: false, message: 'Ya existe un usuario con ese código.' };
    }

    const nuevoUsuario = await repository.create({
        codigo,
        nombre,
        password,
        rol: rolFinal,
        activo: true
    });

    if (!nuevoUsuario) {
        return { success: false, message: 'No se pudo crear el usuario.' };
    }

    return {
        success: true,
        message: 'Usuario creado exitosamente',
        usuario: sanitize(nuevoUsuario)
    };
};

const login = async ({ codigo, password, rol }) => {
    if (!codigo || !password || !rol) {
        return { success: false, message: 'Código, password o rol incorrectos.' };
    }

    const usr = await repository.findByCodigo(codigo);
    if (!usr) {
        return { success: false, message: 'Código o password incorrectos.' };
    }

    if (usr.password !== password) {
        return { success: false, message: 'Código o password incorrectos.' };
    }

    if (usr.rol !== rol) {
        return { success: false, message: 'El rol seleccionado no coincide con la cuenta.' };
    }

    if (!usr.activo) {
        return { success: false, message: 'Tu cuenta se encuentra bloqueada. Contacta al administrador.' };
    }

    return {
        success: true,
        message: 'Inicio de sesión exitoso',
        usuario: sanitize(usr)
    };
};

const contarReclamos = async (usuarioId) => {
    const reclamos = await reclamoRepo.findByUsuario(usuarioId);
    const aprobados = reclamos.filter((r) => r.estado === 'aprobado').length;
    return { totalReclamos: reclamos.length, aprobados };
};

const listarUsuarios = async () => {
    const usuarios = await repository.findAll();
    return Promise.all((usuarios ?? []).map(async (u) => ({
        ...sanitize(u),
        ...(await contarReclamos(u.id))
    })));
};

const toggleAcceso = async (id) => {
    const usuario = await repository.findOne(id);
    if (!usuario) {
        return { success: false, message: 'Usuario no encontrado.' };
    }

    const actualizado = await repository.setActivo(id, !usuario.activo);

    return {
        success: true,
        message: actualizado.activo ? 'Acceso habilitado.' : 'Acceso revocado.',
        usuario: sanitize(actualizado)
    };
};

const usuarioService = { registrar, login, listarUsuarios, toggleAcceso };

export default usuarioService;