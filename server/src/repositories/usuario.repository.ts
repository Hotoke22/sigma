import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {SigmaDbDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Mascotas} from '../models';
import {MascotasRepository} from './mascotas.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {

  public readonly mascotas: HasManyRepositoryFactory<Mascotas, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.SigmaDB') dataSource: SigmaDbDataSource, @repository.getter('MascotasRepository') protected mascotasRepositoryGetter: Getter<MascotasRepository>,
  ) {
    super(Usuario, dataSource);
    this.mascotas = this.createHasManyRepositoryFactoryFor('mascotas', mascotasRepositoryGetter,);
    this.registerInclusionResolver('mascotas', this.mascotas.inclusionResolver);
  }
}
