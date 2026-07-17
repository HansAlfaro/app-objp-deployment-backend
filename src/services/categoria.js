import categoriaRepo from '../repositories/categoria.js';

const toApi = (categoria) => {
    if (!categoria) return null;
    return categoria.get ? categoria.get({ plain: true }) : categoria;
};

const listar = async () => {
    const categorias = await categoriaRepo.findAllOrdenadas();
    return (categorias ?? []).map(toApi);
};

const crear = async ({ nombre }) => {
    const nombreLimpio = (nombre ?? '').trim();

    if (!nombreLimpio) {
        return { success: false, message: 'Proporcione un nombre de categoría.' };
    }

    // Evita duplicados sin distinguir mayúsculas/minúsculas (ej. "Ropa" y "ropa").
    const existentes = await categoriaRepo.findAll();
    const yaExiste = (existentes ?? []).some(
        (c) => c.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase()
    );

    if (yaExiste) {
        return { success: false, message: 'Esa categoría ya existe.' };
    }

    const categoria = await categoriaRepo.create({ nombre: nombreLimpio });

    if (!categoria) {
        return { success: false, message: 'No se pudo crear la categoría.' };
    }

    return { success: true, message: 'Categoría creada correctamente.', categoria: toApi(categoria) };
};

const eliminar = async (id) => {
    const categoria = await categoriaRepo.findOne(id);
    if (!categoria) {
        return { success: false, message: 'Categoría no encontrada.' };
    }
    await categoriaRepo.remove(id);
    return { success: true, message: 'Categoría eliminada.' };
};

const categoriaService = { listar, crear, eliminar, toApi };

export default categoriaService;