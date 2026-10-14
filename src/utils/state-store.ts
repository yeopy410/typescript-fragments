type Handler<T> = (data: T) => void;



export interface StateStoreForSubscriber<T> {
  get(): T;
  subscribe(handler: Handler<T>): void;
  unsubscribe(handler: Handler<T>): void;
}



export class StateStore<T> {
  #data: T;
  #handlerSet: Set<Handler<T>> = new Set();

  constructor(input: T) {
    this.#data = input;
  }

  get() {
    return this.#data;
  }

  set(input: T) {
    this.#data = input;
    this.#handlerSet.forEach(handler => handler(input));
  }

  subscribe(handler: Handler<T>) {
    this.#handlerSet.add(handler);
  }

  unsubscribe(handler: Handler<T>) {
    this.#handlerSet.delete(handler);
  }

}



export function derivedStateStore<T, U>(
  stateStore: StateStore<T>,
  func: (data: T) => U
): StateStore<U> {
  const store = new StateStore(func(stateStore.get()));
  stateStore.subscribe(data => store.set(func(data)));
  return store;
}