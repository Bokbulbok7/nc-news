# Northcoders News API

# Summary
A Reddit like backend server which built APIs using Node.js, Express and PostgreSQL for accessing data from the database.

# Installations
Clone the project with 'git clone repo_url' and install all the needed dependencies through 'npm install' or 'npm i'.

# .env files
To succesfully connect the two databases, add the environment files (.env.development and/or .env.test) with their psql database names (PG_DATABASE=your_database_name). Refer the database name in db/setup.sql and update for both .env files accordingly.

# Setup
Now, run command 'npm run setup-dbs' to create the databases required.
Then, to run the seeding file, 'npm run seed'.
To run the tests, 'npm run test'.
Refer package.json for other scripts.

# Versions
Node v21.1.0
PostgreSQL 14.9