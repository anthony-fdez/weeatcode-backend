/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();

const config = (module.exports = {
  PORT: process.env.PORT,
  PGUSER: process.env.PGUSER,
  PGHOST: process.env.PGHOST,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE,
  PGPORT: process.env.PGPORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET:
    "this_is_the_sercret_and_needs_to_be_changed_but_for_now_it_works",
});
