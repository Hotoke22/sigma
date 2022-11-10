import {
  Entity,
  model,
  property,
  hasOne,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {Pet} from './pet.model';

/**
 * Se asignan restricciones de valores unicos a los atributos email y a cédula.
 * para que un usuario ya registrado no pueda volver a registrarse ni con su número de
 * cédula, ni con el primer correo utilizado.
 */
@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
      uniqueIdCard: {
        keys: {
          idCard: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  idCard: string;

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

  /**
   * La contraseña del usuario se asigna en controllers/user-management.controller.ts
   * y se extiende hacia el modelo user.
   */

  /*@property({
    type: 'string',
    required: true,
  })
  password: string;*/

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @property({
    type: 'string',
  })
  resetKey?: string;

  @property({
    type: 'number',
  })
  resetCount: number;

  @property({
    type: 'string',
  })
  resetTimestamp: string;

  @property({
    type: 'string',
  })
  resetKeyTimestamp: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @belongsTo(() => Pet)
  petId: string;

  @hasMany(() => Pet)
  pets: Pet[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
