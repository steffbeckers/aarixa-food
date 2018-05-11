@echo off
start powershell -noexit -command "mongod"
start powershell Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
start powershell -noexit -command "npm start"
start powershell -noexit -command "cd client; npm start"
code C:\dev\aariXaFood
start "" http://localhost:3333/
start "" http://localhost:8080/
exit