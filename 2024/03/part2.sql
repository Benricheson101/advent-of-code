-- sqlite3 < part2.sql

with recursive cte(keep, a, rest) as (
  select false, '', readfile('input') || 'do()' as rest
  union all
    select
      keep,
      substr(rest, 1, instr(rest, ')')) as a,
      substr(rest, instr(rest, ')')+1) as rest
    from cte
  where
    rest like '%mul(%'
    or rest like '%do()%'
    or rest like '%dont''()%'
),
numbers as (
  select
    replace(a, rtrim(a, replace(a, '(', '')), '') n,
    a,
    row_number() over () id,
    rest,
    case
      when a like '%do()' then true
      when a like '%don''t()' then false
      else lag(keep, 1, true) over ()
    end keep
  from cte
  where
    a regexp 'mul\(\d+,\d+\)$'
    or a like '%do()'
    or a like '%don''t()'
),
numbers2 as (
  select
    n,
    id,
    cast(substr(n, 1, instr(n, ',')-1) as integer) as l,
    cast(substr(n, instr(n, ',')+1) as integer) as r
  from numbers
  where
    n != ''
    and l
    and r
),
numbers3 as (
  select
    id,
    keep,
    lag(keep, 1, true) over () prev_keep,
    lag(id, 1, 0) over () prev_id
  from numbers
  where
    a like '%do()'
    or a like '%don''t()'
)
select sum (n2.l * n2.r)
from numbers3 n3
join numbers2 n2
where
  prev_keep
  and (
    n2.id >= n3.prev_id + 1
    and n2.id <= n3.id - 1
  )
