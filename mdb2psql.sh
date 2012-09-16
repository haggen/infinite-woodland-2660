#!/bin/bash

# Requires mdb-tools [1] and psql [2]
##
# 1 - http://mdbtools.sourceforge.net
# 2 - http://www.postgresql.org

MDB_FILE_PATH=./dnecom.mdb
PSQL_OPTIONS="-q -h localhost"

[ ! -s "$MDB_FILE_PATH" ] && echo "'$MDB_FILE_PATH' not found" && exit 1

[ "$(which mdb-export)" == "" ] && echo "mdb-tools not found" && exit 1

psql $PSQL_OPTIONS -f - <<< "DROP DATABASE IF EXISTS dne; CREATE DATABASE dne;" >> /dev/null

mdb-schema $MDB_FILE_PATH postgres | psql $PSQL_OPTIONS -f - -d dne

for TABLE in $(mdb-tables $MDB_FILE_PATH); do
  mdb-export -X \" -d ";" -R "\n" $MDB_FILE_PATH $TABLE | sed 1d | psql $PSQL_OPTIONS -c "COPY \"$TABLE\" FROM STDIN DELIMITERS ';' csv" -d dne >> /dev/null
done

echo Done\!

exit 0
