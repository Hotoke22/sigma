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
  Plan,
  Mascotas,
} from '../models';
import {PlanRepository} from '../repositories';

export class PlanMascotasController {
  constructor(
    @repository(PlanRepository) protected planRepository: PlanRepository,
  ) { }

  @get('/plans/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Array of Plan has many Mascotas',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Mascotas)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Mascotas>,
  ): Promise<Mascotas[]> {
    return this.planRepository.mascotas(id).find(filter);
  }

  @post('/plans/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Plan model instance',
        content: {'application/json': {schema: getModelSchemaRef(Mascotas)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Plan.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascotas, {
            title: 'NewMascotasInPlan',
            exclude: ['id'],
            optional: ['planId']
          }),
        },
      },
    }) mascotas: Omit<Mascotas, 'id'>,
  ): Promise<Mascotas> {
    return this.planRepository.mascotas(id).create(mascotas);
  }

  @patch('/plans/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Plan.Mascotas PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascotas, {partial: true}),
        },
      },
    })
    mascotas: Partial<Mascotas>,
    @param.query.object('where', getWhereSchemaFor(Mascotas)) where?: Where<Mascotas>,
  ): Promise<Count> {
    return this.planRepository.mascotas(id).patch(mascotas, where);
  }

  @del('/plans/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Plan.Mascotas DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Mascotas)) where?: Where<Mascotas>,
  ): Promise<Count> {
    return this.planRepository.mascotas(id).delete(where);
  }
}
