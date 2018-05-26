@echo off
start powershell -noexit -command "mongod"
start powershell -noexit -command "npm start"
start powershell -noexit -command "cd client; npm start"
code C:\dev\aariXaFood
start "" http://localhost:3333/
start "" http://localhost:8080/
exit