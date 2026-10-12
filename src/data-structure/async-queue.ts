export default class AsyncQueue<T> {
  #valueBuffer: T[] = [];
  #pullBuffer: PromiseWithResolvers<T>[] = [];

  /**
   * Resolves immediately if a value is available; otherwise, waits until a value is pushed.
   */
  pull() {
    if (this.#valueBuffer.length) {
      return Promise.resolve(this.#valueBuffer.shift()!);
    }

    const pendingPull = Promise.withResolvers<T>();
    this.#pullBuffer.push(pendingPull);
    return pendingPull.promise;
  }

  push(value: T) {
    if (this.#pullBuffer.length) {
      this.#pullBuffer.shift()!.resolve(value);
    } else {
      this.#valueBuffer.push(value);
    }
  }

  /**
   * Clears all buffered values.
   * @param cleanup Called for each buffered value before it is removed.
   */
  clearValueBuffer(cleanup?: (value: T) => void) {
    if (cleanup) {
      this.#valueBuffer.forEach(cleanup);
    }
    this.#valueBuffer.length = 0;
  }

  /**
   * Clears all buffered pulls.
   * @param reason Reject reason.
   */
  clearPullBuffer(reason?: unknown) {
    this.#pullBuffer.forEach(({ reject }) => reject(reason));
    this.#pullBuffer.length = 0;
  }

}