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
  Mascotas,
  Plan,
} from '../models';
import {MascotasRepository} from '../repositories';

export class MascotasPlanController {
  constructor(
    @repository(MascotasRepository) protected mascotasRepository: MascotasRepository,
  ) { }

  @get('/mascotas/{id}/plan', {
    responses: {
      '200': {
        description: 'Mascotas has one Plan',
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
    return this.mascotasRepository.plan(id).get(filter);
  }

  @post('/mascotas/{id}/plan', {
    responses: {
      '200': {
        description: 'Mascotas model instance',
        content: {'application/json': {schema: getModelSchemaRef(Plan)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Mascotas.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plan, {
            title: 'NewPlanInMascotas',
            exclude: ['id'],
            optional: ['mascotasId']
          }),
        },
      },
    }) plan: Omit<Plan, 'id'>,
  ): Promise<Plan> {
    return this.mascotasRepository.plan(id).create(plan);
  }

  @patch('/mascotas/{id}/plan', {
    responses: {
      '200': {
        description: 'Mascotas.Plan PATCH success count',
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
    return this.mascotasRepository.plan(id).patch(plan, where);
  }

  @del('/mascotas/{id}/plan', {
    responses: {
      '200': {
        description: 'Mascotas.Plan DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Plan)) where?: Where<Plan>,
  ): Promise<Count> {
    return this.mascotasRepository.plan(id).delete(where);
  }
}
