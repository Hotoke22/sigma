import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {Pet, PetRelations, Plan} from '../models';
import {PlanRepository} from './plan.repository';

export class PetRepository extends DefaultCrudRepository<
  Pet,
  typeof Pet.prototype.id,
  PetRelations
> {

  public readonly plan: HasOneRepositoryFactory<Plan, typeof Pet.prototype.id>;

  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource, @repository.getter('PlanRepository') protected planRepositoryGetter: Getter<PlanRepository>,
  ) {
    super(Pet, dataSource);
    this.plan = this.createHasOneRepositoryFactoryFor('plan', planRepositoryGetter);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
