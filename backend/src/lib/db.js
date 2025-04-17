import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const db =new  pg.Client({
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT
  });
  db.connect();
  
  db.query("select now()", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Database connected successfully:😄", result.rows);
    }
  });
export default db;  