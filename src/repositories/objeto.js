import model from '../models/objeto.js';
import RepositoryBase from './RepositoryBase.js';

class ObjetoRepository extends RepositoryBase {
    async findByEstado(estado) {
        try {
            return await this.model.findAll({
                where: { estado: estado }
            });
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async setEstado(id, estado) {
        try {
            const objeto = await this.findOne(id);
            if (!objeto) return null;
            objeto.estado = estado;
            await objeto.save();
            return objeto;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

const repository = new ObjetoRepository(model);

export default repository;
