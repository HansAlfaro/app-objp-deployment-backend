import model from '../models/categoria.js';
import RepositoryBase from './RepositoryBase.js';

class CategoriaRepository extends RepositoryBase {
    async findByNombre(nombre) {
        try {
            return await this.model.findOne({
                where: { nombre: nombre }
            });
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async findAllOrdenadas() {
        try {
            return await this.model.findAll({
                order: [['nombre', 'ASC']]
            });
        } catch (error) {
            console.log(error)
            return []
        }
    }
}

const repository = new CategoriaRepository(model);

export default repository;