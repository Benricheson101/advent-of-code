import type {SizedTuple} from './tuple';
import type {Assert, Cast} from './util';

export type Add<A extends number, B extends number> = Cast<
  [...SizedTuple<A>, ...SizedTuple<B>]['length'],
  number
>;

type Test_Add = Assert<Add<5, 10>, 15>;

export type Subtract<
  A extends number,
  B extends number,
> = SizedTuple<A> extends [...SizedTuple<B>, ...infer D extends number[]]
  ? D['length']
  : 0;

type Test_Subtract = Assert<Subtract<10, 4>, 6>;

export type LT<A extends number, B extends number> = A extends B
  ? false
  : A extends 0
    ? true
    : B extends 0
      ? false
      : LT<Subtract<A, 1>, Subtract<B, 1>>;

type Test_LT = Assert<LT<5, 10>, true>;

export type LTE<A extends number, B extends number> = A extends B
  ? true
  : A extends 0
    ? true
    : B extends 0
      ? false
      : LT<Subtract<A, 1>, Subtract<B, 1>>;

type Test_LTE = Assert<LTE<10, 10>, true>;

export type GT<A extends number, B extends number> = LTE<A, B> extends true
  ? false
  : true;

type Test_GT = Assert<GT<15, 10>, true>;
