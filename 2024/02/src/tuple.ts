import type {Add, Subtract} from './math';

export type SizedTuple<
  N extends number,
  T extends number[] = [],
> = T['length'] extends N ? T : SizedTuple<N, [...T, 0]>;

export type Partition<
  N extends number,
  T extends number[],
  P extends number[] = [],
> = P['length'] extends N
  ? [P, T]
  : T extends [infer Head extends number, ...infer Tail extends number[]]
    ? Partition<N, Tail, [...P, Head]>
    : [P, T];

type Test_Partition = Partition<2, [0, 1, 2, 3, 4]>;
//   ^?

export type RemoveElem<N extends number, T extends number[]> = Partition<
  N,
  T
> extends [
  infer Head extends number[],
  [infer _Rmv extends number, ...infer Rest extends number[]],
]
  ? [...Head, ...Rest]
  : never;

type Test_RemoveElem = RemoveElem<4, [0, 1, 2, 3, 4]>;
//   ^?
