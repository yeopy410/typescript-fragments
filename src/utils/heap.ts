export default class Heap<T> {
  #heap: Array<T> = [];
  #compareFn: (a: T, b: T) => number;

  /**
   * @param compareFn Negative: 'a' has higher priority, Positive: 'b' has higher priority, Zero: equal priority.
   */
  constructor(compareFn: (a: T, b: T) => number) {
    this.#compareFn = compareFn;
  }

  get size() {
    return this.#heap.length;
  }

  get peek(): T | undefined {
    return this.#heap[0];
  }



  push(value: T): void {
    const heap = this.#heap;
    const compareFn = this.#compareFn;

    let i = heap.length;

    while (i > 0) {
      const parent = (i - 1) >> 1;

      if (compareFn(heap[parent], value) <= 0) break;
      heap[i] = heap[parent];

      i = parent;
    }

    heap[i] = value;
  }



  pop(): T | undefined {
    const heap = this.#heap;
    if (heap.length <= 1) return heap.pop();
    const result = heap[0];

    const last = heap.pop()!;
    const size = heap.length;
    const compareFn = this.#compareFn;

    let i = 0;

    while (true) {
      const left = (i << 1) + 1;
      if (left >= size) break;
      let child = left;

      const right = left + 1;
      if (right < size && compareFn(heap[right], heap[left]) < 0) {
        child = right;
      }

      if (compareFn(last, heap[child]) <= 0) break;
      heap[i] = heap[child];

      i = child;
    }

    heap[i] = last;
    return result;
  }

}