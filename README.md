# WeEatCode Backend Server

This is the backend server for https://weeatcode.com

This server will handle the authentication of users, creating blog posts, comments under the posts, some basic analytics like view count on the posts, upvotes and downvotes to the posts, and other features.

## Contributing

To get started and ad a feature of fix a bug, fork the project and download it to your computer.
Then run `npm install` to install all the dependencies.

You are gonna need a PostgreSQL database to be able to develop locally. Go ahead and set up a local database, (there are pretty good tutorials online that guide you to do this).

Then create a .env file in the root of the project that will look like this:

```
PGUSER= 'your database user'
PGHOST= 'the host'
PGPASSWORD= 'password'
PGDATABASE= 'database'
PGPORT= '5432 (the porst is usually this)'
LGORITHM= 'a hashing algorithm for the passwords like this one => HS384'
JWT_SECRET= 'a random string that you want, but needs to be secret'
BCRYPT= 10
```

After this is set up you should be able to run the project locally, to start the project in development mode run:

`npm run dev-start`

And you should see `Connected to db` printed in the console if everything is set up correctly.

### Tests

Tu run the tests just do `npm test`, nothing will be merged to the main with a test failing.
