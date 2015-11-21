# zoombud-express
Hello Llamas!

1. Download the 2 databases and set them up in your local MySQL environment
2. Update db.js and strain_db.js with credentials from Step 1
3. Open command prompt or terminal. Drill into project directory
4. Run 'npm install'
5. To start local express server, type 'nodemon' -- nodemon will auto reload server on file save
6. If you want to change the port your server runs on, open bin/www and update line 15


## Setting up MySQL DBs
1. If you don't have MySQL, download and install it.
2. During install, it should prompt you to enter a password for the 'root' user. I'd suggest leaving it blank so you don't have to remember one.
3. For each database, you'll need to create a database, user, and password, and give that user permissions to the database.
This can be done with 2 MySQL commands if you are connected via terminal.

You may have to drill into the directory where the mysql executable if 'mysql' is not a global command on your system.
ie. $ cd /wamp/bin/mysql/mysql5.5.24/bin
$ mysql -u root -p
(it will prompt you for password, hit enter if you don't have one, otherwise enter it)
(once connected)
mysql> CREATE DATABASE zoombud;
mysql> GRANT ALL ON zoombud.* TO zoombud@'localhost' IDENTIFIED BY 's0m3b@da55p@ssw0rd';
mysql> exit;
(exits your out of the mysql executable)
$ mysql -u root -p zoombud < zoombud_db_dump_that_you_downloaded.sql

You may need to put the downloaded sql dump file in the same directory that you're in when you connect to the mysql executable.. otherwise, the last command may work like this:
$ mysql -u root -p zoombud < /path/to/zoombud_db_dump_that_you_downloaded.sql

That should really be it.. you'll have to do this twice for each db of course. I usually use the same username as the database name for clarity and simplicity sakes.
In the example above where it reads: zoombud@'localhost'  -- 'zoombud' is the user you're creating to have access to the database.

use this for reference:
http://www.thegeekstuff.com/2008/09/backup-and-restore-mysql-database-using-mysqldump/