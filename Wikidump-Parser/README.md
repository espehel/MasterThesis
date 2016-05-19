#Wikidump Parser


##Setting up database:

run db:  
* `mysql.server start`
* `mysql -uroot`
* check if it needs to start with sudo on your system

Create database:
* `CREATE DATABASE wikipedia`

Create tables:  
* from Wikidump-Parser directory run command: `mysql -u root wikipedia < database/createdb.sql`

if problem with db already running and pid stuff:  
* find PID: `ps -ef | grep mysql` 
* PID is the number in the second column
* kill process: `kill -9 PID`

##Config file

Alter fields to fit your system set up.

* `pageCount` is used when not starting from the beginning of the dump.
* `databaseConfig` must be altered to the database used for storing the parsed objects.
* `dumpLocation` is where the XML dump is located on your system.

##Parsing

* debug: `node-debug index.js`
* normal: `node index.js`