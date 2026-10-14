/**
 * Schedule resolve and reject tasks as macrotasks,
 * allowing microtasks (promises and async iterators) to run between macrotasks.
 */
export default class EventPoint<T> {
  #event = Promise.withResolvers<T>();

  get event() {
    return this.#event.promise;
  }

  async *[Symbol.asyncIterator]() {
    while (true) yield await this.#event.promise;
  }

  resolve(value: T) {
    setTimeout(() => {
      this.#event.resolve(value);
      this.#event = Promise.withResolvers<T>();
    });
  }

  reject(reason?: unknown) {
    setTimeout(() => {
      this.#event.reject(reason);
      this.#event = Promise.withResolvers<T>();
    });
  }

}