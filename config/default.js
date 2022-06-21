/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const config = module.exports = {
    PORT: process.env.PORT,
    PGUSER: process.env.PGUSER,
    PGHOST: process.env.PGHOST,
    PGPASSWORD: process.env.PGPASSWORD,
    PGDATABASE: process.env.PGDATABASE,
    PGPORT: process.env.PGPORT
}