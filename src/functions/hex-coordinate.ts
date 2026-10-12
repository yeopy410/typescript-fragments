const [X, Y] = [0, 1];

// coordinate
// y | x
// 0 | 0   1   2   3   4
// 1 |   0   1   2   3   4
// 2 | 0   1   2   3   4
// 3 |   0   1   2   3   4
// 4 | 0   1   2   3   4

// relative coordinate
//  y | x
// -2 | -2  -1   0  +1  +2
// -1 |   -2  -1  +1  +2  +3
//  0 | -2  -1  *0  +1  +2
// +1 |   -2  -1  +1  +2  +3
// +2 | -2  -1   0  +1  +2

// -2 |   -2  -1   0  +1  +2
// -1 | -3  -2  -1  +1  +2
//  0 |   -2  -1  *0  +1  +2
// +1 | -3  -2  -1  +1  +2
// +2 |   -2  -1   0  +1  +2

// index
//  0   1   2   3   4
//    5   6   7   8   9
// 10  11  12  13  14
//   15  16  17  18  19
// 20  21  22  23  24



/**
 * @param gridSize vector
 * @param base vector
 * @param coordinate coordinate
 */
export function calcVectorFromCoordinate(gridSize: number[], base: number[], coordinate: number[]) {
  return [
    base[X] + gridSize[X]*( coordinate[X]*2 + (coordinate[Y] & 1) ),
    base[Y] + gridSize[Y]*coordinate[Y]*3
  ];
}

/**
 * @param gridSize vector
 * @param vector vector
 */
export function calcCoordinateFromVector(gridSize: number[], vector: number[]) {
  const gridX = Math.floor(vector[X] / gridSize[X]);
  const coordinateY = Math.floor((vector[Y] - gridSize[Y]*0.5) / (gridSize[Y]*3));

  return [ (gridX - (coordinateY&1))>>1, coordinateY ];
}



/**
 * 인덱스가 undefined이라면 유효범위를 벗어난 유효하지 않은 좌표라는 의미.
 * @param mapSize coordinate
 * @param coordinate coordinate
 */
export function calcIndexFromCoordinate(mapSize: number[], coordinate: number[]) {
  return (
    0 <= coordinate[X] && coordinate[X] < mapSize[X] &&
    0 <= coordinate[Y] && coordinate[Y] < mapSize[Y]
  )
  ? coordinate[X] + mapSize[X]*coordinate[Y]
  : undefined;
}

/**
 * @param mapSize coordinate
 * @param index index
 */
export function calcCoordinateFromIndex(mapSize: number[], index: number) {
  const coordinateX = index % mapSize[X];

  return [ coordinateX, (index-coordinateX) / mapSize[X] ];
}

/**
 * @param mapSize coordinate
 * @param coordinates coordinate[]
 */
export function calcIndexesFromCoordinates(mapSize: number[], coordinates: number[][]) {
  const indexes = [];

  for (let i = 0; i < coordinates.length; i += 1) {
    const index = calcIndexFromCoordinate(mapSize, coordinates[i]);
    if (index != null) indexes.push(index);
  }

  return indexes;
}

/**
 * @param mapSize coordinate
 * @param index index
 */
export function calcNeighborIndexesFromIndex(mapSize: number[], index: number) {
  const coordinate = calcCoordinateFromIndex(mapSize, index);
  const indexes = [];

  for (let i = 0; i < directions.length; i += 1) {
    const target = calcIndexFromCoordinate(mapSize, calcCoordinateFromRelativeCoordinate(coordinate, directions[i]));
    if (target != null) indexes.push(target);
  }

  return indexes;
}

const directions = [
  [-1,-1], [ 1,-1],
  [-1, 0], [ 1, 0],
  [-1, 1], [ 1, 1]
];



/**
 * @param rel relative coordinate
 */
export function calcDistanceFromRelativeCoordinate(rel: number[]) {
  const dx = Math.abs(rel[X]);
  const dy = Math.abs(rel[Y]);

  return dy + Math.max(dx - Math.ceil(dy * 0.5), 0);
}

/**
 * @param ref reference coordinate
 * @param distance distance
 */
export function calcCoordinatesFromDistance(ref: number[], distance: number) {
  const coordinates = [];

  for (let dx = distance+1; --dx; ) {
    coordinates.push(shiftX(ref, dx));
    coordinates.push(shiftX(ref, -dx));
  }

  for (const direction of straightDirections) {
    let reference = shiftX(ref, -distance);

    for (let yCounter = distance+1; --yCounter; ) {
      reference = calcCoordinateFromRelativeCoordinate(reference, direction);

      for (let dx = distance + yCounter; dx--; ) {
        coordinates.push(shiftX(reference, dx));
      }
    }
  }

  return coordinates;
}

function shiftX(coordinate: number[], dx: number) {
  return [ coordinate[X] + dx, coordinate[Y] ];
}

const straightDirections = [[1,-1], [1,1]];



/**
 * @param ref reference coordinate
 * @param target coordinate
 */
export function calcRelativeCoordinateFromCoordinates(ref: number[], target: number[]) {
  const dx = target[X] - ref[X];
  const dy = target[Y] - ref[Y];

  // when dy is odd:
  //   referenceY is odd  && dx <= 0: resultX -= 1.
  //   referenceY is even && dx >= 0: resultX += 1.

  // (i32 >>> 31) extracts the sign bit.

  return [
    dx + ( (ref[Y] & 1) ? -(((dx-1) >>> 31) & dy) : +(((dx >>> 31)^1) & dy) ),
    dy
  ];
}

/**
 * @param ref reference coordinate
 * @param rel relative coordinate
 */
export function calcCoordinateFromRelativeCoordinate(ref: number[], rel: number[]) {
  // when relativeY is odd:
  //   relativeX === 0 is impossible.
  //   referenceY is odd  && relativeX < 0: resultX += 1.
  //   referenceY is even && relativeX > 0: resultX -= 1.

  return [
    (ref[X] + rel[X]) + (rel[X] < 0 ? +(1 & rel[Y] & ref[Y]) : -(1 & rel[Y] & (ref[Y]^1))),
    (ref[Y] + rel[Y])
  ];
}