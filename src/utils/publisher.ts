type Listener<T> = (data: T) => void;



export interface Subscribable<T> {
  subscribe(listener: Listener<T>): void;
  unsubscribe(listener: Listener<T>): void;
  once(listener: Listener<T>): void;
}



export default class Publisher<T> implements Subscribable<T> {
  #listeners = new Set<Listener<T>>();

  subscribe(listener: Listener<T>) {
    this.#listeners.add(listener);
  }

  unsubscribe(listener: Listener<T>) {
    this.#listeners.delete(listener);
  }

  once(listener: Listener<T>) {
    const onceListener = (data: T) => {
      this.unsubscribe(onceListener);
      listener(data);
    };
    this.subscribe(onceListener);
  }

  publish(data: T) {
    for (const listener of [...this.#listeners]) {
      listener(data);
    }
  }

  get asSubscribable(): Subscribable<T> {
    return this;
  }

}