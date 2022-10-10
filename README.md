# NodeJS recruitment test task solution notes

[typescript-express-starter](https://www.npmjs.com/package/typescript-express-starter) was used as a boilerplate.

For quick local deployment just run the following commands (assuming Docker and NodeJS are already installed):

- `docker-compose up -d`

- `npm install`

- `npm run dev`

Tests can be run with `npm run test`.

To populate the DB run `npm run migrate:up`. After that you can use `test_user_1@testing.com` (for other users just change the number up to 10) and `123` as the password.

For simple documentation on available methods and quick testing Swagger can be accessed at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/) once the server is running
