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
