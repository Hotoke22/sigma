import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SigmaDbDataSource} from '../datasources';
import {ProductosServicios, ProductosServiciosRelations} from '../models';

export class ProductosServiciosRepository extends DefaultCrudRepository<
  ProductosServicios,
  typeof ProductosServicios.prototype.id,
  ProductosServiciosRelations
> {
  constructor(
    @inject('datasources.SigmaDB') dataSource: SigmaDbDataSource,
  ) {
    super(ProductosServicios, dataSource);
  }
}
