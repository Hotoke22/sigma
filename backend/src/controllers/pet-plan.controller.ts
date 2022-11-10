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
  Pet,
  Plan,
} from '../models';
import {PetRepository} from '../repositories';

export class PetPlanController {
  constructor(
    @repository(PetRepository) protected petRepository: PetRepository,
  ) { }

  @get('/pets/{id}/plan', {
    responses: {
      '200': {
        description: 'Pet has one Plan',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Plan),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Plan>,
  ): Promise<Plan> {
    return this.petRepository.plan(id).get(filter);
  }

  @post('/pets/{id}/plan', {
    responses: {
      '200': {
        description: 'Pet model instance',
        content: {'application/json': {schema: getModelSchemaRef(Plan)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Pet.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plan, {
            title: 'NewPlanInPet',
            exclude: ['id'],
            optional: ['petId']
          }),
        },
      },
    }) plan: Omit<Plan, 'id'>,
  ): Promise<Plan> {
    return this.petRepository.plan(id).create(plan);
  }

  @patch('/pets/{id}/plan', {
    responses: {
      '200': {
        description: 'Pet.Plan PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plan, {partial: true}),
        },
      },
    })
    plan: Partial<Plan>,
    @param.query.object('where', getWhereSchemaFor(Plan)) where?: Where<Plan>,
  ): Promise<Count> {
    return this.petRepository.plan(id).patch(plan, where);
  }

  @del('/pets/{id}/plan', {
    responses: {
      '200': {
        description: 'Pet.Plan DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Plan)) where?: Where<Plan>,
  ): Promise<Count> {
    return this.petRepository.plan(id).delete(where);
  }
}
