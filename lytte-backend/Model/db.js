// db.js
import mysql from 'mysql2';
import fs from 'fs'
export const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABSE ,
    ssl: {
        ca: fs.readFileSync('Model/ca.pem') // Adjust the path to your CA certific
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID:', db.threadId);
});



