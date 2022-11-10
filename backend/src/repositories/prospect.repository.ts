import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {Prospect, ProspectRelations} from '../models';

export class ProspectRepository extends DefaultCrudRepository<
  Prospect,
  typeof Prospect.prototype.id,
  ProspectRelations
> {
  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource,
  ) {
    super(Prospect, dataSource);
  }
}
