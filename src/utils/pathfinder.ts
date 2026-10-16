import Heap from './heap.js';



/**
 * Use {@link Pathfinder.create} to create instances.
 */
export default class Pathfinder {
  #parentMap;

  constructor(
    parentMap: Array<number | undefined>,
    public readonly reachableNodes: ReadonlySet<number>
  ) {
    this.#parentMap = parentMap;
  }

  hasPathTo(targetKey: number) {
    return this.reachableNodes.has(targetKey);
  }

  /**
   * Returns the path excluding the start key, or undefined if the target is unreachable.
   */
  getPathTo(targetKey: number) {
    if (!this.hasPathTo(targetKey)) return undefined;
    const parentMap = this.#parentMap;

    const path: number[] = [];
    let currentKey = targetKey;

    while (currentKey !== parentMap[currentKey]) {
      path.push(currentKey);
      currentKey = parentMap[currentKey]!;
    }

    return path.reverse();
  }



  /**
   * Finds all nodes reachable from the start,
   * choosing a path that leaves the most remaining energy for each node.
   * @param getVisitCost Returns the non-negative cost of visiting a node.
   */
  static create(
    getVisitCost: (key: number) => number,
    getNeighbors: (key: number) => number[],
    startKey: number,
    startEnergy: number
  ) {
    // Sparse arrays indexed by node key.
    const parentMap: Array<number | undefined> = [];
    const energyMap: Array<number | undefined> = [];
    const compareFn = (a: number, b: number) => energyMap[b]! - energyMap[a]!;
    const priorityQueue = new Heap<number>(compareFn);
    const reachableNodes = new Set<number>();

    // Mark the Start Node using itself as its parent.
    parentMap[startKey] = startKey;
    energyMap[startKey] = startEnergy;
    priorityQueue.push(startKey);
    reachableNodes.add(startKey);

    while (priorityQueue.size) {
      const parentKey = priorityQueue.pop()!;
      const parentEnergy = energyMap[parentKey]!;

      const childKeys = getNeighbors(parentKey);
      for (let i = 0; i < childKeys.length; i += 1) {
        const childKey = childKeys[i];
        // The first found path leaves the most energy; no need to reconsider.
        if (parentMap[childKey] != null) continue;

        const remainingEnergy = parentEnergy - getVisitCost(childKey);
        if (remainingEnergy < 0) continue;

        parentMap[childKey] = parentKey;
        energyMap[childKey] = remainingEnergy;
        priorityQueue.push(childKey);
        reachableNodes.add(childKey);
      }
    }

    return new Pathfinder(parentMap, reachableNodes);
  }

}