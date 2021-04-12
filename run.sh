#!/bin/bash
filename=$1
ROOT=$(pwd)
echo $ROOT
while read line; do
# reading each line
#echo $line
#mkdir -p $line 
cd $line
touch abc.scml
echo "line 1" > abc.scml
cd $ROOT

done < $filename