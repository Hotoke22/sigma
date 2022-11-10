import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Pet} from '../models';
import {PetRepository} from '../repositories';

export class PetController {
  constructor(
    @repository(PetRepository)
    public petRepository: PetRepository,
  ) {}

  @post('/pets')
  @response(200, {
    description: 'Pet model instance',
    content: {'application/json': {schema: getModelSchemaRef(Pet)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pet, {
            title: 'NewPet',
            exclude: ['id'],
          }),
        },
      },
    })
    pet: Omit<Pet, 'id'>,
  ): Promise<Pet> {
    return this.petRepository.create(pet);
  }

  @get('/pets/count')
  @response(200, {
    description: 'Pet model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Pet) where?: Where<Pet>): Promise<Count> {
    return this.petRepository.count(where);
  }

  @get('/pets')
  @response(200, {
    description: 'Array of Pet model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pet, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Pet) filter?: Filter<Pet>): Promise<Pet[]> {
    return this.petRepository.find(filter);
  }

  @patch('/pets')
  @response(200, {
    description: 'Pet PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pet, {partial: true}),
        },
      },
    })
    pet: Pet,
    @param.where(Pet) where?: Where<Pet>,
  ): Promise<Count> {
    return this.petRepository.updateAll(pet, where);
  }

  @get('/pets/{id}')
  @response(200, {
    description: 'Pet model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pet, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Pet, {exclude: 'where'}) filter?: FilterExcludingWhere<Pet>,
  ): Promise<Pet> {
    return this.petRepository.findById(id, filter);
  }

  @patch('/pets/{id}')
  @response(204, {
    description: 'Pet PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pet, {partial: true}),
        },
      },
    })
    pet: Pet,
  ): Promise<void> {
    await this.petRepository.updateById(id, pet);
  }

  @put('/pets/{id}')
  @response(204, {
    description: 'Pet PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() pet: Pet,
  ): Promise<void> {
    await this.petRepository.replaceById(id, pet);
  }

  @del('/pets/{id}')
  @response(204, {
    description: 'Pet DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.petRepository.deleteById(id);
  }
}
