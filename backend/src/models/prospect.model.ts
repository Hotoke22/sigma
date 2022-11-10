import {Entity, model, property} from '@loopback/repository';

@model()
export class Prospect extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  surname: string;

  @property({
    type: 'string',
    required: true,
  })
  cellphone: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  comment: string;


  constructor(data?: Partial<Prospect>) {
    super(data);
  }
}

export interface ProspectRelations {
  // describe navigational properties here
}

export type ProspectWithRelations = Prospect & ProspectRelations;
