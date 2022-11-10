import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Pet,
} from '../models';
import {UserRepository} from '../repositories';

export class UserPetController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/pets', {
    responses: {
      '200': {
        description: 'Array of User has many Pet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Pet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Pet>,
  ): Promise<Pet[]> {
    return this.userRepository.pets(id).find(filter);
  }

  @post('/users/{id}/pets', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pet, {
            title: 'NewPetInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) pet: Omit<Pet, 'id'>,
  ): Promise<Pet> {
    return this.userRepository.pets(id).create(pet);
  }

  @patch('/users/{id}/pets', {
    responses: {
      '200': {
        description: 'User.Pet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pet, {partial: true}),
        },
      },
    })
    pet: Partial<Pet>,
    @param.query.object('where', getWhereSchemaFor(Pet)) where?: Where<Pet>,
  ): Promise<Count> {
    return this.userRepository.pets(id).patch(pet, where);
  }

  @del('/users/{id}/pets', {
    responses: {
      '200': {
        description: 'User.Pet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Pet)) where?: Where<Pet>,
  ): Promise<Count> {
    return this.userRepository.pets(id).delete(where);
  }
}
