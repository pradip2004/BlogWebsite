import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
dotenv.config()


export const sql = neon(process.env.DB_URL!)


export const initDB = async () => {
      try {
            await sql`
                  CREATE TABLE IF NOT EXISTS blogs(
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description VARCHAR(255) NOT NULL,
                        blogcontent TEXT NOT NULL,
                        image VARCHAR(255) NOT NULL,
                        category VARCHAR(255) NOT NULL,
                        author VARCHAR(255) NOT NULL,
                        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                  );
            `;

            await sql`
                  CREATE TABLE IF NOT EXISTS comments(
                        id SERIAL PRIMARY KEY,
                        comment VARCHAR(255) NOT NULL,
                        userid VARCHAR(255) NOT NULL,
                        username VARCHAR(255) NOT NULL,
                        blogid VARCHAR(255) NOT NULL,
                        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `;

            await sql`
            CREATE TABLE IF NOT EXISTS savedblogs(
                  id SERIAL PRIMARY KEY,
                  userid VARCHAR(255) NOT NULL,
                  blogid VARCHAR(255) NOT NULL,
                  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        console.log("DB initialized successfully");
      } catch (error) {
            console.log("Error in DB connection", error)

      }
}