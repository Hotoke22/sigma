import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Mascotas,
  Usuario,
} from '../models';
import {MascotasRepository} from '../repositories';

export class MascotasUsuarioController {
  constructor(
    @repository(MascotasRepository)
    public mascotasRepository: MascotasRepository,
  ) { }

  @get('/mascotas/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Mascotas',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuario)},
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.string('id') id: typeof Mascotas.prototype.id,
  ): Promise<Usuario> {
    return this.mascotasRepository.usuario(id);
  }
}
