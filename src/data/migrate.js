import sequelize from '../config/database.js';
import Usuario from '../models/usuario.js';
import Objeto from '../models/objeto.js';
import Reclamo from '../models/reclamo.js';
import Categoria from '../models/categoria.js';



const usuarios = [
    { id: 1, codigo: 'admin',    nombre: 'Administrador', password: '$2b$10$lyviUM90K9CrcEzmECMS1OKiIk3AzUS3ZaU0BiwFsV5exiMrlrpwi', rol: 'admin',   activo: true },
    { id: 2, codigo: '20231456', nombre: 'Piero Leon',     password: '$2b$10$vk4GkmpiB3IXwLrjNybfxu38MCUaxmu5Qp6r8otJYNm1fvcGtr56.', rol: 'student', activo: true },
    { id: 3, codigo: '20220890', nombre: 'Ana Torres',     password: '$2b$10$vk4GkmpiB3IXwLrjNybfxu38MCUaxmu5Qp6r8otJYNm1fvcGtr56.', rol: 'student', activo: true },
    { id: 4, codigo: '20210055', nombre: 'Carlos Flores',  password: '$2b$10$vk4GkmpiB3IXwLrjNybfxu38MCUaxmu5Qp6r8otJYNm1fvcGtr56.', rol: 'student', activo: false }
];

const objetos = [
    { id: 1, nombre: 'Teclado Mecánico Royal Kludge RK-M75', categoria: 'Electrónicos',         descripcion: 'Encontrado en el pabellón W, piso 3. Tiene switches lineales y keycaps gris/blanco.', icono: '⌨️', ubicacion: 'I2 - Piso 3 - Aula 303', estado: 'disponible' },
    { id: 2, nombre: 'Raqueta de Frontón con dos pelotas',    categoria: 'Deportes',              descripcion: 'Olvidada en las bancas de la zona deportiva del campus.', icono: '🎾', ubicacion: 'Pasillos', estado: 'disponible' },
    { id: 3, nombre: 'Mochila con Mouse Bloody AL90',         categoria: 'Electrónicos',          descripcion: 'Encontrada en el aula V-402. La mochila contiene un mouse óptico de alta precisión.', icono: '🎒', ubicacion: 'D1 - Piso 4 - Aula 402', estado: 'disponible' },
    { id: 4, nombre: 'Cuaderno Justus Azul',                  categoria: 'Útiles Estudiantiles',  descripcion: 'Encontrado en el tercer piso de la biblioteca, mesa de estudio individual.', icono: '📘', ubicacion: 'Pasillos', estado: 'disponible' }
];

const reclamos = [
    { id: 1, objetoId: 1, usuarioId: 2, evidencia: 'Tiene un sticker personalizado en la base trasera y usa switches custom.', estado: 'pendiente' }
];

const categorias = [
    { id: 1, nombre: 'Electrónicos' },
    { id: 2, nombre: 'Deportes' },
    { id: 3, nombre: 'Útiles Estudiantiles' },
    { id: 4, nombre: 'Prendas de Vestir' },
    { id: 5, nombre: 'Accesorios' },
    { id: 6, nombre: 'Otros' }
];

async function migrate() {
    try {
        await sequelize.sync({ force: true });
        await Usuario.bulkCreate(usuarios);
        await Categoria.bulkCreate(categorias);
        await Objeto.bulkCreate(objetos);
        await Reclamo.bulkCreate(reclamos);

        for (const tabla of ['usuarios', 'categorias', 'objetos', 'reclamos']) {
            await sequelize.query(
                `SELECT setval(pg_get_serial_sequence('${tabla}', 'id'), (SELECT MAX(id) FROM ${tabla}))`
            );
        }

        console.log(`Migración completada: ${usuarios.length} usuarios, ${categorias.length} categorías, ${objetos.length} objetos y ${reclamos.length} reclamos insertados.`);
    } catch (error) {
        console.error('Error en la migración:', error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

migrate();