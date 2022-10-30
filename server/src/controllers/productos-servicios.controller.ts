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
import {ProductosServicios} from '../models';
import {ProductosServiciosRepository} from '../repositories';

export class ProductosServiciosController {
  constructor(
    @repository(ProductosServiciosRepository)
    public productosServiciosRepository : ProductosServiciosRepository,
  ) {}

  @post('/productos-servicios')
  @response(200, {
    description: 'ProductosServicios model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductosServicios)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductosServicios, {
            title: 'NewProductosServicios',
            exclude: ['id'],
          }),
        },
      },
    })
    productosServicios: Omit<ProductosServicios, 'id'>,
  ): Promise<ProductosServicios> {
    return this.productosServiciosRepository.create(productosServicios);
  }

  @get('/productos-servicios/count')
  @response(200, {
    description: 'ProductosServicios model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductosServicios) where?: Where<ProductosServicios>,
  ): Promise<Count> {
    return this.productosServiciosRepository.count(where);
  }

  @get('/productos-servicios')
  @response(200, {
    description: 'Array of ProductosServicios model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductosServicios, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductosServicios) filter?: Filter<ProductosServicios>,
  ): Promise<ProductosServicios[]> {
    return this.productosServiciosRepository.find(filter);
  }

  @patch('/productos-servicios')
  @response(200, {
    description: 'ProductosServicios PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductosServicios, {partial: true}),
        },
      },
    })
    productosServicios: ProductosServicios,
    @param.where(ProductosServicios) where?: Where<ProductosServicios>,
  ): Promise<Count> {
    return this.productosServiciosRepository.updateAll(productosServicios, where);
  }

  @get('/productos-servicios/{id}')
  @response(200, {
    description: 'ProductosServicios model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductosServicios, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ProductosServicios, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductosServicios>
  ): Promise<ProductosServicios> {
    return this.productosServiciosRepository.findById(id, filter);
  }

  @patch('/productos-servicios/{id}')
  @response(204, {
    description: 'ProductosServicios PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductosServicios, {partial: true}),
        },
      },
    })
    productosServicios: ProductosServicios,
  ): Promise<void> {
    await this.productosServiciosRepository.updateById(id, productosServicios);
  }

  @put('/productos-servicios/{id}')
  @response(204, {
    description: 'ProductosServicios PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() productosServicios: ProductosServicios,
  ): Promise<void> {
    await this.productosServiciosRepository.replaceById(id, productosServicios);
  }

  @del('/productos-servicios/{id}')
  @response(204, {
    description: 'ProductosServicios DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productosServiciosRepository.deleteById(id);
  }
}
