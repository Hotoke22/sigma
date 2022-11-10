import {Entity, model, property, hasOne} from '@loopback/repository';
import {Plan} from './plan.model';

@model()
export class Pet extends Entity {
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
  species: string;

  @property({
    type: 'string',
  })
  comment?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @hasOne(() => Plan)
  plan: Plan;

  constructor(data?: Partial<Pet>) {
    super(data);
  }
}

export interface PetRelations {
  // describe navigational properties here
}

export type PetWithRelations = Pet & PetRelations;
