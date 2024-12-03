import type {Input1, Input2} from './input';
import type {Add, GT, LT, Subtract} from './math';

export type Level = number;
export type Levels = readonly Level[];
export type LevelsList = readonly Levels[];

export type Assert<A, _ extends A> = A;

export type Cast<V, T> = V extends T ? V : never;

export type SplitLines<
  S extends string,
  Lines extends string[] = [],
> = S extends `${infer Fst extends string}\n${infer Rest extends string}`
  ? SplitLines<Rest, [...Lines, Fst]>
  : [...Lines, S];

type Test_SplitLines = Assert<SplitLines<'abc\ndef'>, ['abc', 'def']>;

export type ParseLevel<
  Line extends string,
  Lvls extends Levels = [],
> = Line extends `${infer A extends Level} ${infer Rest extends string}`
  ? ParseLevel<Rest, [...Lvls, A]>
  : Line extends `${infer A extends Level}`
    ? readonly [...Lvls, A]
    : Lvls;

type Test_ParseLevel = Assert<ParseLevel<'1 2 3 4 5'>, [1, 2, 3, 4, 5]>;

export type ParseLevels<
  Lines extends string[],
  Lvls extends LevelsList = [],
> = Lines extends [infer Head extends string, ...infer Tail extends string[]]
  ? ParseLevels<Tail, [...Lvls, ParseLevel<Head>]>
  : Lvls;

type Test_ParseLevels = Assert<
  ParseLevels<['1 2 3 4 5', '6 7 8 9 0']>,
  [readonly [1, 2, 3, 4, 5], readonly [6, 7, 8, 9, 0]]
>;

export type ParseInput<S extends string> = ParseLevels<SplitLines<S>>;

type Test_ParseInput = Assert<
  ParseInput<'1 2 3 4 5\n6 7 8 9 0'>,
  [readonly [1, 2, 3, 4, 5], readonly [6, 7, 8, 9, 0]]
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

namespace Part1 {
  type AllIncreasing<L extends readonly number[]> = L extends []
    ? true
    : L extends readonly [
          infer A extends number,
          infer B extends number,
          ...infer Rest extends number[],
        ]
      ? IsIncreasing<A, B> extends true
        ? AllIncreasing<[B, ...Rest]>
        : false
      : true;

  type Test_AllIncreasing = Assert<AllIncreasing<[1, 3, 4, 6, 8, 11]>, true>;

  type AllDecreasing<L extends readonly number[]> = L extends []
    ? true
    : L extends readonly [
          infer A extends number,
          infer B extends number,
          ...infer Rest extends number[],
        ]
      ? IsDecreasing<A, B> extends true
        ? AllDecreasing<[B, ...Rest]>
        : false
      : true;

  type Test_AllDecreasing = Assert<AllDecreasing<[11, 8, 6, 4, 2, 1]>, true>;

  type IsSafe<Line extends Levels> = AllIncreasing<Line> extends true
    ? true
    : AllDecreasing<Line> extends true
      ? true
      : false;

  type CountSafeLines<
    Lines extends LevelsList,
    N extends number = 0,
  > = Lines extends [
    infer Line extends Levels,
    ...infer Rest extends LevelsList,
  ]
    ? IsSafe<Line> extends true
      ? CountSafeLines<Rest, Add<N, 1>>
      : CountSafeLines<Rest, N>
    : N;

  type Test_CountSafeLines = Assert<
    CountSafeLines<[[1, 2, 3, 4, 5], [1, 2, 3, 4, 3]]>,
    1
  >;

  type Parsed1 = ParseInput<Input1>;
  type Parsed2 = ParseInput<Input2>;
  type Counts1 = CountSafeLines<Parsed1>;
  type Counts2 = CountSafeLines<Parsed2>;

  export type Solution = Add<Counts1, Counts2>;
  //    ^?
}
