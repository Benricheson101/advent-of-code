#!/usr/bin/env zsh

left_list=()
typeset -A right_list

for line in ${(f)"$(<${1:-/dev/stdin})"} ; do
  IFS=' ' read -r left right <<< "$line"
  left_list+=$left
  if ((${+right_list[$right]})) ; then
    right_list[$right]=$((right_list[$right] + 1))
  else
    right_list[$right]=1
  fi
done

left_list=(${(u)left_list})

sum=0
for n in $left_list ; do
  if ((${+right_list[$n]})) ; then
    local count=${right_list[$n]}
    ((sum+=(count*n)))
  fi
done

print $sum
