#!/bin/sh
minio server /data --console-address ":9001" &
sleep 5
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb --ignore-existing local/meu-bucket
wait
