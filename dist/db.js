import { Pool } from "pg";
const db = new Pool({
    user: "postgres",
    password: "141107",
    host: "localhost",
    port: 5432,
    database: "postgres2"
});
export default db;
