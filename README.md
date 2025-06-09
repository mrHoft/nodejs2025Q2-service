# Home Library Service

## Installing
- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- `git clone {repository URL}`
- `npm install` (not needed if you using docker image)
- `cp .env.example .env` (important! prepare environment)
- `npm run db:prepare` (important! prepare local database folder)

## Running application
`npm start` - Start docker compose with postgres and nest app containers in daemon mode
`npm stop` - Stop and remove containers

After starting the app on port (4000 as default) you can open in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Testing
Command | Description
--- | ---
`npm run test` | Run all tests without authorization
`npm run test:auth` | Run all test with authorization

## Auto-fix and format
Command | Description
--- | ---
`npm run lint` | Auto-fix
`npm run format` | Auto-format

## Database
Command | Description
--- | ---
`npm run db:prepare` | prepare local database folder
`npm run migration:run` | create initial tables in database
`npm run migration:revert` | delete all tables from database

## Project structure
```markdown
db/                    # Folder is used for database files
doc/                   # Open API documentation
migrations/            # TypeORM migrations
src/
  ├── main.ts          # Nest server entry point
  ├── data-source.ts   # TypeORM data source
  ├── album            # Nest route
  ├── artist           # Nest route
  ├── favorites        # Nest route
  ├── track            # Nest route
  ├── user             # Nest route
  ├── shared           # Types and DTOs
  └── entities         # TypeORM entities
test/                  # Tests
```
