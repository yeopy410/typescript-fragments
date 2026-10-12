type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  never;

type TypeNameTuple<T extends readonly unknown[]> = {
  [K in keyof T]: TypeName<T[K]>;
};

type Constructor = new (...args: any[]) => any;



export default function createUnknownArgsConstructor<T extends Constructor>(
  constructor: T,
  parameterTypes: TypeNameTuple<ConstructorParameters<T>>
) {
  const isCorrectArgs = (args: unknown[]): args is ConstructorParameters<typeof constructor> => {
    for (let i = 0; i < parameterTypes.length; i += 1) {
      if (typeof args[i] !== parameterTypes[i]) {
        return false;
      }
    }
    return true;
  }

  return (argList: unknown): InstanceType<T> => {
    if (!Array.isArray(argList)) {
      throw new Error('Args is not array');
    }

    if (!isCorrectArgs(argList)) {
      throw new Error('Args is not correct constructor parameters');
    }

    return new constructor(...argList);
  }

}



// 사용 예시
class Aaa {
  static fromUnknownArgList = createUnknownArgsConstructor(Aaa, ['number', 'string']);

  constructor(
    public readonly aa: number,
    public readonly bb: string,
  ) {}

  toList() {
    return [
      this.aa,
      this.bb,
    ];
  }
}