import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import debugFactory from 'debug';
const debug = debugFactory('loopback:example:shopping');

export interface TaskStatus<T> {
  done: boolean;
  value?: T | null;
}

/**
 * Una tarea que se puede volver a intentar
 */
export interface Task<T> {
  run(): Promise<TaskStatus<T>>;
  description: string;
}

/**
 * Opciones para reintentar
 */
export interface RetryOptions {
  /**
   * Número máximo de intentos, incluida la primera ejecución.
   */
  maxTries?: number;
  /**
   * Milisegundos de espera después de cada intento
   */
  interval?: number;
}

/**
 * Vuelve a intentar una tarea por un número de veces con el intervalo dado en ms
 * @param task Objeto de tarea {run, description}
 * @param maxTries Número máximo de intentos (incluida la primera ejecución),
 * predeterminado 10
 * @param interval Milisegundos de espera después de cada intento, predeterminado a 100 ms
 */
export async function retry<T>(
  task: Task<T>,
  {maxTries = 10, interval = 100}: RetryOptions = {},
): Promise<T> {
  if (maxTries < 1) maxTries = 1;
  let triesLeft = maxTries;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    debug(
      'Try %s (%d/%d)',
      task.description,
      maxTries - triesLeft + 1,
      maxTries,
    );
    const status = await task.run();
    if (status.done) return status.value!;
    if (--triesLeft > 0) {
      debug('Wait for %d ms', interval);
      await sleep(interval);
    } else {
      // No más reintentos, timeout
      const msg = `Fallado ${task.description} despues ${
        maxTries * interval
      } ms`;
      debug('%s', msg);
      throw new HttpErrors.RequestTimeout(msg);
    }
  }
}

/**
 * Sleep for the given milliseconds
 * @param ms Number of milliseconds to wait
 */
export const sleep = promisify(setTimeout); // (ms: number) => Promise<void>
