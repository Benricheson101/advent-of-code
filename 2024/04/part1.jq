#!/usr/bin/env jq -Rnsrf

# usage: ./part1.jq < input

def find:
  [.[] | match(["(?=(?:XMAS|SAMX))", "g"])] | length
;

def parse_input:
  rtrimstr("\n") | split("\n")
;

def shift(n):
  . | split("") as $chars |
  length as $sz |
  ([range(n) | "?"] + $chars + [range($sz - n - 1) | "?"]) |
  join("")
;

def shift_lines:
  . as $lines |
  [
    [range($lines | length)][] |
    (
      . as $idx |
      $lines[$idx] as $line |
      $line | shift($idx)
    )
  ]
;

def reverse_lines:
  [.[] | split("") | reverse | join("")]
;

def transpose_lines:
  [.[] | split("")] | transpose | [.[] | join("")]
;

def solution:
  parse_input as $input |
  ($input | find)                                                   # find horizontal
  + ($input | transpose_lines | find)                               # find vertical
  + ($input | shift_lines | transpose_lines | find)                 # find diagonal (top right -> bottom left)
  + ($input | reverse_lines | shift_lines | transpose_lines | find) # find diagonal (top left -> bottom right)
;

input | solution
