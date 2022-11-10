import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  HasOneRepositoryFactory,
  BelongsToAccessor,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {User, UserCredentials, Pet} from '../models';
import {UserCredentialsRepository} from './user-credentials.repository';
import {PetRepository} from './pet.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  public readonly pet: BelongsToAccessor<Pet, typeof User.prototype.id>;

  public readonly pets: HasManyRepositoryFactory<Pet, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongoAtlas') dataSource: juggler.DataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('PetRepository')
    protected petRepositoryGetter: Getter<PetRepository>,
  ) {
    super(User, dataSource);
    this.pets = this.createHasManyRepositoryFactoryFor(
      'pets',
      petRepositoryGetter,
    );
    this.registerInclusionResolver('pets', this.pets.inclusionResolver);
    this.pet = this.createBelongsToAccessorFor('pet', petRepositoryGetter);
    this.registerInclusionResolver('pet', this.pet.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
