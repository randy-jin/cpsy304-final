const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mysql2/promise'); // Use mysql2 for promise support
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const dbConfig = {
    user: 'fnzfllwqzw',
    password: 'k1Ag54s2DMOAr4$e',
    server: 'randywebapp-server.mysql.database.azure.com',
    database: 'randywebapp-database',
    options: {
        encrypt: true
    }
};

app.get('/', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { fullname, email, studentid, program, date } = req.body;
    try {
        await sql.connect(dbConfig);
        await sql.query`INSERT INTO Students (FullName, Email, StudentID, Program, EnrollmentDate) 
                        VALUES (${fullname}, ${email}, ${studentid}, ${program}, ${date})`;
        res.redirect('/students');
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

app.get('/students', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM Students`;
        res.render('students', { students: result.recordset });
    } catch (err) {
        res.status(500).send('Error fetching students: ' + err.message);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on port ${port}`));