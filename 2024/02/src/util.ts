export type Assert<A, _ extends A> = A;

export type Cast<V, T> = V extends T ? V : never;

export type SplitLines<
  S extends string,
  Lines extends string[] = [],
> = S extends `${infer Fst extends string}\n${infer Rest extends string}`
  ? SplitLines<Rest, [...Lines, Fst]>
  : [...Lines, S];

type Test_SplitLines = Assert<SplitLines<'abc\ndef'>, ['abc', 'def']>;
