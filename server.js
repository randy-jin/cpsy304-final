const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const dbConfig = {
    host: 'randywebapp-server.mysql.database.azure.com',
    user: 'fnzfllwqzw',
    password: 'k1Ag54s2DMOAr4$e',
    database: 'randywebapp-database',
    ssl: {
        rejectUnauthorized: true
    }
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { fullname, email, studentid, program, date } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO Students (FullName, Email, StudentID, Program, EnrollmentDate) VALUES (?, ?, ?, ?, ?)',
            [fullname, email, studentid, program, date]
        );
        connection.release();
        res.redirect('/students');
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

app.get('/students', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM Students');
        connection.release();
        res.render('students', { students: rows });
    } catch (err) {
        res.status(500).send('Error fetching students: ' + err.message);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on port ${port}`));