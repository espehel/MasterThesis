
run db:  
* `mysql-server start`
* `mysql -uroot`
* check if it needs to start with sudo on your system

Create database:
* `CREATE DATABASE wikipedia`

Create tables:  
* from `~` run command: `mysql -u root wikipedia < Development/Repositories/MasterThesis/Wikidump-Parser/database/createdb.sql`

if problem with db already running and pid stuff:  
* find PID: `ps -ef | grep mysql`
* kill process: `kill -9 PID`
