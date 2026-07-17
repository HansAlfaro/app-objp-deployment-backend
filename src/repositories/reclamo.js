import model from '../models/reclamo.js';
import RepositoryBase from './RepositoryBase.js';

class ReclamoRepository extends RepositoryBase {
    async findByEstado(estado) {
        try {
            return await this.model.findAll({
                where: { estado: estado },
                order: [['id', 'ASC']]
            });
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async findByUsuario(usuarioId) {
        try {
            return await this.model.findAll({
                where: { usuarioId: parseInt(usuarioId) }
            });
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async findByObjeto(objetoId) {
        try {
            return await this.model.findAll({
                where: { objetoId: parseInt(objetoId) }
            });
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async findByUsuarioYObjeto(usuarioId, objetoId) {
        try {
            return await this.model.findOne({
                where: {
                    usuarioId: parseInt(usuarioId),
                    objetoId: parseInt(objetoId)
                }
            });
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

const repository = new ReclamoRepository(model);

export default repository;