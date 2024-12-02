#!/usr/bin/env zsh

left_list=()
right_list=()

for line in ${(f)"$(<${1:-/dev/stdin})"} ; do
  IFS=' ' read -r left right <<< "$line"
  left_list+=$left
  right_list+=$right
done

left_list=(${(n)left_list})
right_list=(${(n)right_list})

sum=0
for ((i = 1; i < ((${#left_list}+1)); i++)); do
  local left=${left_list[i]}
  local right=${right_list[i]}

  local diff=${$((left-right))#-}
  ((sum+=diff))
done

print $sum
