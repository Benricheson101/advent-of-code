#!/usr/bin/env jq -Rnsrf

# usage: ./part1.jq < input

include "./util" ;

def find:
  [.[] | match(["(?=(?:XMAS|SAMX))", "g"])] | length
;

def solution:
  parse_input as $input |
  ($input | find)                                                   # find horizontal
  + ($input | transpose_lines | find)                               # find vertical
  + ($input | shift_lines | transpose_lines | find)                 # find diagonal (top right -> bottom left)
  + ($input | reverse_lines | shift_lines | transpose_lines | find) # find diagonal (top left -> bottom right)
;

input | solution
