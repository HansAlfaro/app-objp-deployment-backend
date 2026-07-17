import reclamoRepo from '../repositories/reclamo.js';
import objetoRepo from '../repositories/objeto.js';
import usuarioRepo from '../repositories/usuario.js';
import objetoService from './objeto.js';

const enriquecer = async (reclamo) => {
    const plain = reclamo.get ? reclamo.get({ plain: true }) : reclamo;
    const objeto = await objetoRepo.findOne(plain.objetoId);
    const alumno = await usuarioRepo.findOne(plain.usuarioId);
    return {
        ...plain,
        objetoNombre: objeto?.nombre ?? null,
        objetoIcono: objeto?.icono ?? null,
        objetoCategoria: objeto?.categoria ?? null,
        objetoDescripcion: objeto?.descripcion ?? null,
        objetoUbicacion: objeto?.ubicacion ?? null,
        alumnoCodigo: alumno?.codigo ?? null,
        alumnoNombre: alumno?.nombre ?? null
    };
};

const listarPendientes = async () => {
    const reclamos = await reclamoRepo.findByEstado('pendiente');
    return Promise.all(reclamos.map(enriquecer));
};

const listarPorUsuario = async (usuarioId) => {
    const reclamos = await reclamoRepo.findByUsuario(usuarioId);
    return Promise.all(reclamos.map(enriquecer));
};

const crear = async (usuarioId, { objetoId, evidencia }) => {
    if (!objetoId || !evidencia) {
        return { success: false, message: 'Debes enviar el objeto y la evidencia.' };
    }

    const objeto = await objetoRepo.findOne(objetoId);
    if (!objeto) {
        return { success: false, message: 'El objeto no existe.' };
    }

    if (objeto.estado !== 'disponible') {
        return { success: false, message: 'Este objeto ya no está disponible para reclamar.' };
    }

    const reclamoExistente = await reclamoRepo.findByUsuarioYObjeto(usuarioId, objetoId);
    if (reclamoExistente) {
        return { success: false, message: 'Ya has reclamado este objeto. No puedes reclamarlo de nuevo.' };
    }

    const reclamo = await reclamoRepo.create({
        objetoId: parseInt(objetoId),
        usuarioId: parseInt(usuarioId),
        evidencia,
        estado: 'pendiente'
    });

    if (!reclamo) {
        return { success: false, message: 'No se pudo enviar el reclamo.' };
    }

    return {
        success: true,
        message: 'Tu reclamo ha sido enviado correctamente. El administrador validará las evidencias.',
        reclamo: await enriquecer(reclamo)
    };
};

const resolver = async (id, aprobado, motivoRechazo) => {
    const reclamo = await reclamoRepo.findOne(id);
    if (!reclamo || reclamo.estado !== 'pendiente') {
        return { success: false, message: 'Reclamo no encontrado o ya fue resuelto.' };
    }

    reclamo.estado = aprobado ? 'aprobado' : 'rechazado';
    reclamo.motivoRechazo = aprobado ? null : (motivoRechazo?.trim() || null);
    await reclamo.save();

    if (aprobado) {
        await objetoService.marcarReclamado(reclamo.objetoId);
    }

    return {
        success: true,
        message: aprobado
            ? 'Reclamo ACEPTADO. Se notificará al alumno para que recoja su objeto.'
            : 'Reclamo RECHAZADO. Las evidencias no coinciden con el objeto registrado.',
        reclamo: await enriquecer(reclamo)
    };
};

const reclamoService = { listarPendientes, listarPorUsuario, crear, resolver };

export default reclamoService;