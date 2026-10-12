const [X, Y] = [0, 1];

export function sum(vector2List: number[][]) {
  let base = [0, 0];
  for (const vector of vector2List) {
    base[X] += vector[X];
    base[Y] += vector[Y];
  }
  return base;
}

export function add(base: number[], target: number[]) {
  return [
    base[X] + target[X],
    base[Y] + target[Y]
  ]
}

export function delta(reference: number[], target: number[]) {
  return [
    target[X] - reference[X],
    target[Y] - reference[Y]
  ]
}

export function scalarMul(vector2: number[], scalar: number) {
  return [vector2[X]*scalar, vector2[Y]*scalar];
}

export function divfloor(dividend: number[], divisor: number[]) {
  return [
    Math.floor(dividend[X] / divisor[X]),
    Math.floor(dividend[Y] / divisor[Y])
  ]
}

export function divmod(dividend: number[], divisor: number[]) {
  const remainder = [
    dividend[X] % divisor[X],
    dividend[Y] % divisor[Y]
  ];
  const quotient = [
    (dividend[X] - remainder[X]) / divisor[X],
    (dividend[Y] - remainder[Y]) / divisor[Y]
  ];
  return [quotient, remainder];
}

export function hypotenuse(vector2: number[]) {
  return Math.sqrt( vector2[X]**2 + vector2[Y]**2 );
}