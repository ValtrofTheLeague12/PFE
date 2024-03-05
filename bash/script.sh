cd c:/RESTAPI

git add .

current_datetime=$(date +"%Y-%m-%d %H:%M:%S.%3N")

git commit -m "REST API $current_datetime"

git status