# Home Library Service

## Installing

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- `git clone {repository URL}`
- `npm install`
- `cp .env.example .env`

## Running application

`npm start`

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Testing

After application running open new terminal and enter:

Command | Description
--- | ---
`npm run test` | Run all tests without authorization
`npm run test:auth` | Run all test with authorization

## Auto-fix and format
Command | Description
--- | ---
`npm run lint` | Auto-fix
`npm run format` | Auto-format
