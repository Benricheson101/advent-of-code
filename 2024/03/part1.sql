-- sqlite3 < part1.sql

with recursive cte(a, rest) as (
  select
    '',
    readfile('input')
  union all
    select
      substr(rest, 1, instr(rest, ')')) a,
      substr(rest, instr(rest, ')') + 1) rest
    from cte
    where rest like '%mul(%'
),
numbers(n) as (
  select
    replace(a, rtrim(a, replace(a, '(', '')), '') n
  from cte
  where a regexp 'mul\(\d+,\d+\)$'
),
numbers2(l, r) as (
  select
    cast(substr(n, 1, instr(n, ',') - 1) as integer) l,
    cast(substr(n, instr(n, ',') + 1) as integer) r
  from numbers
  where
    n != ''
    and l
    and r
)
select sum(l * r) part1_solution
from numbers2
