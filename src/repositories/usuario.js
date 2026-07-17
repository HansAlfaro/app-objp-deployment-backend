import model from '../models/usuario.js';
import RepositoryBase from './RepositoryBase.js';

class UsuarioRepository extends RepositoryBase {
    async findByCodigo(codigo) {
        try {
            return await this.model.findOne({
                where: { codigo: codigo }
            });
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async setActivo(id, activo) {
        try {
            const usuario = await this.findOne(id);
            if (!usuario) return null;
            usuario.activo = activo;
            await usuario.save();
            return usuario;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

const repository = new UsuarioRepository(model);

export default repository;
