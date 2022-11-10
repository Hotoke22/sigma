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
import {Prospect} from '../models';
import {ProspectRepository} from '../repositories';

export class ProspectController {
  constructor(
    @repository(ProspectRepository)
    public prospectRepository : ProspectRepository,
  ) {}

  @post('/prospects')
  @response(200, {
    description: 'Prospect model instance',
    content: {'application/json': {schema: getModelSchemaRef(Prospect)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospect, {
            title: 'NewProspect',
            exclude: ['id'],
          }),
        },
      },
    })
    prospect: Omit<Prospect, 'id'>,
  ): Promise<Prospect> {
    return this.prospectRepository.create(prospect);
  }

  @get('/prospects/count')
  @response(200, {
    description: 'Prospect model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Prospect) where?: Where<Prospect>,
  ): Promise<Count> {
    return this.prospectRepository.count(where);
  }

  @get('/prospects')
  @response(200, {
    description: 'Array of Prospect model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Prospect, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Prospect) filter?: Filter<Prospect>,
  ): Promise<Prospect[]> {
    return this.prospectRepository.find(filter);
  }

  @patch('/prospects')
  @response(200, {
    description: 'Prospect PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospect, {partial: true}),
        },
      },
    })
    prospect: Prospect,
    @param.where(Prospect) where?: Where<Prospect>,
  ): Promise<Count> {
    return this.prospectRepository.updateAll(prospect, where);
  }

  @get('/prospects/{id}')
  @response(200, {
    description: 'Prospect model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prospect, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Prospect, {exclude: 'where'}) filter?: FilterExcludingWhere<Prospect>
  ): Promise<Prospect> {
    return this.prospectRepository.findById(id, filter);
  }

  @patch('/prospects/{id}')
  @response(204, {
    description: 'Prospect PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospect, {partial: true}),
        },
      },
    })
    prospect: Prospect,
  ): Promise<void> {
    await this.prospectRepository.updateById(id, prospect);
  }

  @put('/prospects/{id}')
  @response(204, {
    description: 'Prospect PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() prospect: Prospect,
  ): Promise<void> {
    await this.prospectRepository.replaceById(id, prospect);
  }

  @del('/prospects/{id}')
  @response(204, {
    description: 'Prospect DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.prospectRepository.deleteById(id);
  }
}
