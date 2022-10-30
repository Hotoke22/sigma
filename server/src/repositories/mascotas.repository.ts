import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {SigmaDbDataSource} from '../datasources';
import {Mascotas, MascotasRelations, Usuario, Plan} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {PlanRepository} from './plan.repository';

export class MascotasRepository extends DefaultCrudRepository<
  Mascotas,
  typeof Mascotas.prototype.id,
  MascotasRelations
> {

  public readonly usuario: BelongsToAccessor<Usuario, typeof Mascotas.prototype.id>;

  public readonly plan: HasOneRepositoryFactory<Plan, typeof Mascotas.prototype.id>;

  constructor(
    @inject('datasources.SigmaDB') dataSource: SigmaDbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('PlanRepository') protected planRepositoryGetter: Getter<PlanRepository>,
  ) {
    super(Mascotas, dataSource);
    this.plan = this.createHasOneRepositoryFactoryFor('plan', planRepositoryGetter);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}
