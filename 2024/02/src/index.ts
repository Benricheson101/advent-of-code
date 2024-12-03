import type {Input1, Input2} from './input';
import type {Add, GT, LT, Subtract} from './math';
import type {RemoveElem} from './tuple';
import type {Assert, SplitLines} from './util';

type ParseLevel<
  Line extends string,
  Lvls extends number[] = [],
> = Line extends `${infer A extends number} ${infer Rest extends string}`
  ? ParseLevel<Rest, [...Lvls, A]>
  : Line extends `${infer A extends number}`
    ? [...Lvls, A]
    : Lvls;

type Test_ParseLevel = Assert<ParseLevel<'1 2 3 4 5'>, [1, 2, 3, 4, 5]>;

type ParseLevels<
  Lines extends string[],
  Lvls extends number[][] = [],
> = Lines extends [infer Head extends string, ...infer Tail extends string[]]
  ? ParseLevels<Tail, [...Lvls, ParseLevel<Head>]>
  : Lvls;

type Test_ParseLevels = Assert<
  ParseLevels<['1 2 3 4 5', '6 7 8 9 0']>,
  [[1, 2, 3, 4, 5], [6, 7, 8, 9, 0]]
>;

type ParseInput<S extends string> = ParseLevels<SplitLines<S>>;

type Test_ParseInput = Assert<
  ParseInput<'1 2 3 4 5\n6 7 8 9 0'>,
  [[1, 2, 3, 4, 5], [6, 7, 8, 9, 0]]
>;

type IsIncreasing<A extends number, B extends number> = GT<B, A> extends true
  ? Subtract<B, A> extends 1 | 2 | 3
    ? true
    : false
  : false;

type Test_IsIncreasing = Assert<IsIncreasing<1, 3>, true>;

type IsDecreasing<A extends number, B extends number> = LT<B, A> extends true
  ? Subtract<A, B> extends 1 | 2 | 3
    ? true
    : false
  : false;

type Test_IsDecreasing = Assert<IsDecreasing<5, 1>, false>;

type AllIncreasing<L extends number[]> = L extends []
  ? true
  : L extends [
        infer A extends number,
        infer B extends number,
        ...infer Rest extends number[],
      ]
    ? IsIncreasing<A, B> extends true
      ? AllIncreasing<[B, ...Rest]>
      : false
    : true;

type Test_AllIncreasing = Assert<AllIncreasing<[1, 3, 4, 6, 8, 11]>, true>;

type AllDecreasing<L extends number[]> = L extends []
  ? true
  : L extends [
        infer A extends number,
        infer B extends number,
        ...infer Rest extends number[],
      ]
    ? IsDecreasing<A, B> extends true
      ? AllDecreasing<[B, ...Rest]>
      : false
    : true;

type Test_AllDecreasing = Assert<AllDecreasing<[11, 8, 6, 4, 2, 1]>, true>;

type IsSafe<Line extends number[]> = AllIncreasing<Line> extends true
  ? true
  : AllDecreasing<Line> extends true
    ? true
    : false;

type Rmv1<
  T extends number[],
  R extends number[][] = [],
> = R['length'] extends T['length']
  ? [T, ...R]
  : Rmv1<T, [...R, RemoveElem<R['length'], T>]>;

type Test_Rmv1 = Assert<
  Rmv1<[1, 2, 3, 3]>,
  [[1, 2, 3, 3], [2, 3, 3], [1, 3, 3], [1, 2, 3], [1, 2, 3]]
>;
//   ^?

type AnySafe<T extends number[][]> = T extends [
  infer Head extends number[],
  ...infer Rest extends number[][],
]
  ? IsSafe<Head> extends true
    ? true
    : AnySafe<Rest>
  : false;

type Test_AnySafe = Assert<AnySafe<[[1, 2, 3], [1, 10, 2]]>, true>;

namespace Part1 {
  type CountSafeLines<
    Lines extends number[][],
    N extends number = 0,
  > = Lines extends [
    infer Line extends number[],
    ...infer Rest extends number[][],
  ]
    ? IsSafe<Line> extends true
      ? CountSafeLines<Rest, Add<N, 1>>
      : CountSafeLines<Rest, N>
    : N;

  type Test_CountSafeLines = Assert<
    CountSafeLines<[[1, 2, 3, 4, 5], [1, 2, 3, 4, 3]]>,
    1
  >;

  // full input hits tsc recursion limit but splitting in half and adding results works
  type Parsed1 = ParseInput<Input1>;
  type Parsed2 = ParseInput<Input2>;
  type Counts1 = CountSafeLines<Parsed1>;
  type Counts2 = CountSafeLines<Parsed2>;

  export type Solution = Add<Counts1, Counts2>;
}

namespace Part2 {
  type CountSafeLines<
    Lines extends number[][],
    N extends number = 0,
  > = Lines extends [
    infer Line extends number[],
    ...infer Rest extends number[][],
  ]
    ? AnySafe<Rmv1<Line>> extends true
      ? CountSafeLines<Rest, Add<N, 1>>
      : CountSafeLines<Rest, N>
    : N;

  type Parsed1 = ParseInput<Input1>;
  type Parsed2 = ParseInput<Input2>;
  type Counts1 = CountSafeLines<Parsed1>;
  type Counts2 = CountSafeLines<Parsed2>;

  export type Solution = Add<Counts1, Counts2>;
}

type Part1Solution = Part1.Solution;
//   ^?
type Part2Solution = Part2.Solution;
//   ^?
