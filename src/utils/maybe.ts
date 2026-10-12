export type Maybe<T> = Just<T> | null | undefined;



export default function maybe<T>(value: T | null | undefined): Maybe<T> {
  return (value != null) ? new Just(value) : undefined;
}



class Just<T> {
  constructor(public readonly value: T) {}

  map<U>(callback: (value: T) => U | null | undefined): Maybe<U> {
    return maybe(callback(this.value));
  }

  tap(callback: (value: T) => void): Just<T> {
    callback(this.value);
    return this;
  }

}