type AsyncQueueClearOptions<T> = {
  cleanup?: (value: T) => void,
  reason?: unknown
}



export default class AsyncQueue<T> {
  #valueBuffer: T[] = [];
  #pendingPulls: PromiseWithResolvers<T>[] = [];

  /**
   * Returns a promise for the next value, waiting until one is pushed if necessary.
   */
  pull() {
    if (this.#valueBuffer.length) {
      return Promise.resolve(this.#valueBuffer.shift()!);
    } else {
      const pendingPull = Promise.withResolvers<T>();
      this.#pendingPulls.push(pendingPull);
      return pendingPull.promise;
    }
  }

  push(value: T) {
    if (this.#pendingPulls.length) {
      this.#pendingPulls.shift()!.resolve(value);
    } else {
      this.#valueBuffer.push(value);
    }
  }



  /**
   * Clears all buffered values and rejects all pending pull operations.
   */
  clear(options?: AsyncQueueClearOptions<T>) {
    this.clearValues(options?.cleanup);
    this.rejectPendingPulls(options?.reason);
  }

  /**
   * Clears all buffered values.
   * @param cleanup Called for each buffered value before the buffer is cleared.
   */
  clearValues(cleanup?: (value: T) => void) {
    if (cleanup != null) {
      this.#valueBuffer.forEach(cleanup);
    }
    this.#valueBuffer.length = 0;
  }

  /**
   * Rejects all pending pull operations.
   * @param reason The reason for rejecting each pending pull.
   */
  rejectPendingPulls(reason?: unknown) {
    this.#pendingPulls.forEach(({ reject }) => reject(reason));
    this.#pendingPulls.length = 0;
  }

}