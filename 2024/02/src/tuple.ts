export type SizedTuple<
  N extends number,
  T extends number[] = [],
> = T['length'] extends N ? T : SizedTuple<N, [...T, 0]>;
