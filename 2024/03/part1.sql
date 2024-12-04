-- sqlite3 < part1.sql

with recursive cte(a, rest) as (
  select '', readfile('input') as rest
  union all
    select
      substr(rest, 1, instr(rest, ')')) as a,
      substr(rest, instr(rest, ')')+1) as rest
    from cte
    where rest like '%mul(%'
),
numbers as (
  select
    replace(a, rtrim(a, replace(a, '(', '')), '') n,
    a
  from cte
  where a regexp 'mul\(\d+,\d+\)$'
),
numbers2 as (
  select
    cast(substr(n, 1, instr(n, ',')-1) as integer) as l,
    cast(substr(n, instr(n, ',')+1) as integer) as r,
    n, a
  from numbers
  where n != '' and l and r
)
select sum(l * r) n
from numbers2
