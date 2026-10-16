type Listener<T> = (data: T) => void | 'remain' | 'remove';



export default class EventEmitter<EventMap extends object> {
  #listenersByType = new Map<keyof EventMap, Set<Listener<unknown>>>();



  /**
   * @param listener If a listener returns void or 'remain', remain it. If a listener returns 'remove', remove it.
   */
  on<K extends keyof EventMap>(
    type: K,
    listener: Listener<EventMap[K]>,
  ) {
    let listeners = this.#listenersByType.get(type);
    if (listeners == null) {
      listeners = new Set<Listener<unknown>>();
      this.#listenersByType.set(type, listeners);
    }

    listeners.add(listener as Listener<unknown>);
  }



  off<K extends keyof EventMap>(
    type: K,
    listener: Listener<EventMap[K]>
  ) {
    const listeners = this.#listenersByType.get(type);
    if (listeners == null) return;

    listeners.delete(listener as Listener<unknown>);

    if (listeners.size === 0) {
      this.#listenersByType.delete(type);
    }
  }



  emit<K extends keyof EventMap>(
    type: K,
    data: EventMap[K]
  ) {
    const listeners = this.#listenersByType.get(type);
    if (listeners == null) return;

    for (const listener of [...listeners]) {
      if (listener(data) === 'remove') {
        listeners.delete(listener);
      }
    }

    if (listeners.size === 0) {
      this.#listenersByType.delete(type);
    }
  }

}