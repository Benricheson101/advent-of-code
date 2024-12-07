#!/usr/bin/env jq -Rnsrf

# usage: ./part2.jq < input

include "./util";

def mat(n):
  . as $lines |
  {"(?=M.M)": "(?=S.S)", "(?=S.S)": "(?=M.M)", "(?=S.M)": "(?=S.M)", "(?=M.S)": "(?=M.S)"} as $regexs |
  $regexs[] as $r |

  $lines[n] | match([$r, "g"]) as {$offset} |
  select($lines[n+1] | split("") | .[$offset + 1] == "A") |
  select($lines[n+2] | split("") | .[$offset:($offset + 3)] | join("") | test($regexs[$r]))
;

def solution:
  parse_input as $input |
  $input[:-2] as $shortinput |
  [
    [range($shortinput | length)][] as $idx |
    $input | mat($idx)
  ] | length
;

input | solution
