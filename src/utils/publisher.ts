type Listener<T> = (data: T) => void;



export interface Subscribable<T> {
  subscribe(listener: Listener<T>): void;
  unsubscribe(listener: Listener<T>): void;
}



export default class Publisher<T> implements Subscribable<T> {
  #listeners = new Set<Listener<T>>();

  subscribe(listener: Listener<T>) {
    this.#listeners.add(listener);
  }

  unsubscribe(listener: Listener<T>) {
    this.#listeners.delete(listener);
  }

  publish(data: T) {
    for (const listener of [...this.#listeners]) {
      listener(data);
    }
  }

}



/**
 * @returns Wrapped listener for unsubscribe.
 */
export function once<T>(subscribable: Subscribable<T>, listener: Listener<T>) {
  const wrappedListener = (data: T) => {
    subscribable.unsubscribe(wrappedListener);
    listener(data);
  };
  subscribable.subscribe(wrappedListener);
  return wrappedListener;
}