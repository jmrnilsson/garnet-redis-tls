#!/bin/bash
set -e

password=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-128} | head -n 1)
echo "random_word: $password"
