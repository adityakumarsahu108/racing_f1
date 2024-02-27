const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); // Import the c
const app = express();
const port = 4000;
const bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Replace with your MySQL database configuration
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'adisahu8',
    database: 'race_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function createTable() {
    const createDriverTableQuery = `
        CREATE TABLE IF NOT EXISTS driver (
            id INT  PRIMARY KEY,
            name VARCHAR(255) ,
            d_age INT NOT NULL
        )
    `;

    const createTeamTableQuery = `
        CREATE TABLE IF NOT EXISTS team (
            t_id INT  PRIMARY KEY,
            t_name VARCHAR(255) ,
            d_d1 INT,
            FOREIGN KEY (d_d1) REFERENCES driver(id) ON DELETE CASCADE
        )
    `;

    const createRaceDetailsTableQuery = `
        CREATE TABLE IF NOT EXISTS race_details (
            race_id INT AUTO_INCREMENT PRIMARY KEY,
            track_length INT NOT NULL,
            t_safety_car INT,
            weather VARCHAR(255) NOT NULL
        )
    `;

    const createDriverChampionshipTableQuery = `
        CREATE TABLE IF NOT EXISTS driver_championship (
            dc_id INT PRIMARY KEY,
            d_id INT ,
            driver_race_wins INT NOT NULL,
            driver_total_points INT NOT NULL,
            FOREIGN KEY (d_id) REFERENCES driver(id) ON DELETE CASCADE
        )
    `;

    const createResultsTableQuery = `
        CREATE TABLE IF NOT EXISTS results (

            res_id INT PRIMARY KEY,
            d_id INT,
            driver_as_per_position INT,
            FOREIGN KEY (d_id) REFERENCES driver(id) ON DELETE CASCADE
        )
    `;

    try {
        const [result] = await db.query(createDriverTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
    try {
        const [result] = await db.query(createTeamTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
    try {
        const [result] = await db.query(createRaceDetailsTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
    try {
        const [result] = await db.query(createDriverChampionshipTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
    try {
        const [result] = await db.query(createResultsTableQuery);
        console.log('Table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
}

app.get('/fetchAllData', async (req, res) => {
    const fetchAllDataQuery = 'SELECT * FROM driver';

    try {
        const [result] = await db.query(fetchAllDataQuery);
        console.log('Data fetched successfully');
        res.status(200).json(result);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching data');
    }
});

app.post('/submit', async (req, res) => {
    const formData = req.body;

    const insertQuery = 'INSERT INTO driver SET ?';

    try {
        const [result] = await db.query(insertQuery, formData);
        console.log('Data submitted successfully');
        res.status(200).send('Data submitted successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error submitting data');
    }
});

// ... (existing code) ...

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    const deleteQuery = 'DELETE FROM driver WHERE id = ?';

    try {
        const [result] = await db.query(deleteQuery, [id]);
        if (result.affectedRows > 0) {
            console.log(`Data with ID ${id} deleted successfully`);
            res.status(200).send(`Data with ID ${id} deleted successfully`);
        } else {
            console.log(`Data with ID ${id} not found`);
            res.status(404).send(`Data with ID ${id} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting data');
    }
});

app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const updateQuery = 'UPDATE driver SET ? WHERE id = ?';

    try {
        const [result] = await db.query(updateQuery, [updatedData, id]);
        if (result.affectedRows > 0) {
            console.log(`Data with ID ${id} updated successfully`);
            res.status(200).send(`Data with ID ${id} updated successfully`);
        } else {
            console.log(`Data with ID ${id} not found`);
            res.status(404).send(`Data with ID ${id} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating data');
    }
});

// Fetch all teams
app.get('/fetchAllTeams', async (req, res) => {
    const fetchAllTeamsQuery = 'SELECT * FROM team';

    try {
        const [result] = await db.query(fetchAllTeamsQuery);
        console.log('Teams fetched successfully');
        res.status(200).json(result);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching teams');
    }
});

// Add a new team
app.post('/addTeam', async (req, res) => {
    const teamData = req.body;

    const insertTeamQuery = 'INSERT INTO team SET ?';

    try {
        const [result] = await db.query(insertTeamQuery, teamData);
        console.log('Team added successfully');
        res.status(200).send('Team added successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error adding team');
    }
});

// Delete a team
app.delete('/deleteTeam/:id', async (req, res) => {
    const teamId = req.params.id;

    const deleteTeamQuery = 'DELETE FROM team WHERE t_id = ?';

    try {
        const [result] = await db.query(deleteTeamQuery, [teamId]);
        if (result.affectedRows > 0) {
            console.log(`Team with ID ${teamId} deleted successfully`);
            res.status(200).send(`Team with ID ${teamId} deleted successfully`);
        } else {
            console.log(`Team with ID ${teamId} not found`);
            res.status(404).send(`Team with ID ${teamId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting team');
    }
});

// Update team information
app.put('/updateTeam/:id', async (req, res) => {
    const teamId = req.params.id;
    const updatedTeamData = req.body;

    const updateTeamQuery = 'UPDATE team SET ? WHERE t_id = ?';

    try {
        const [result] = await db.query(updateTeamQuery, [updatedTeamData, teamId]);
        if (result.affectedRows > 0) {
            console.log(`Team with ID ${teamId} updated successfully`);
            res.status(200).send(`Team with ID ${teamId} updated successfully`);
        } else {
            console.log(`Team with ID ${teamId} not found`);
            res.status(404).send(`Team with ID ${teamId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating team');
    }
});

// Fetch all race details
app.get('/fetchAllRaceDetails', async (req, res) => {
    const fetchAllRaceDetailsQuery = 'SELECT * FROM race_details';

    try {
        const [result] = await db.query(fetchAllRaceDetailsQuery);
        console.log('Race details fetched successfully');
        res.status(200).json(result);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching race details');
    }
});

// Add new race details
app.post('/addRaceDetails', async (req, res) => {
    const raceDetailsData = req.body;

    const insertRaceDetailsQuery = 'INSERT INTO race_details SET ?';

    try {
        const [result] = await db.query(insertRaceDetailsQuery, raceDetailsData);
        console.log('Race details added successfully');
        res.status(200).send('Race details added successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error adding race details');
    }
});

// Delete race details
app.delete('/deleteRaceDetails/:id', async (req, res) => {
    const raceDetailsId = req.params.id;

    const deleteRaceDetailsQuery = 'DELETE FROM race_details WHERE race_id = ?';

    try {
        const [result] = await db.query(deleteRaceDetailsQuery, [raceDetailsId]);
        if (result.affectedRows > 0) {
            console.log(`Race details with ID ${raceDetailsId} deleted successfully`);
            res.status(200).send(`Race details with ID ${raceDetailsId} deleted successfully`);
        } else {
            console.log(`Race details with ID ${raceDetailsId} not found`);
            res.status(404).send(`Race details with ID ${raceDetailsId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting race details');
    }
});

// Update race details
app.put('/updateRaceDetails/:id', async (req, res) => {
    const raceDetailsId = req.params.id;
    const updatedRaceDetailsData = req.body;

    const updateRaceDetailsQuery = 'UPDATE race_details SET ? WHERE race_id = ?';

    try {
        const [result] = await db.query(updateRaceDetailsQuery, [updatedRaceDetailsData, raceDetailsId]);
        if (result.affectedRows > 0) {
            console.log(`Race details with ID ${raceDetailsId} updated successfully`);
            res.status(200).send(`Race details with ID ${raceDetailsId} updated successfully`);
        } else {
            console.log(`Race details with ID ${raceDetailsId} not found`);
            res.status(404).send(`Race details with ID ${raceDetailsId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating race details');
    }
});

// Fetch all driver championships
app.get('/fetchAllDriverChampionships', async (req, res) => {
    const fetchAllDriverChampionshipsQuery = 'SELECT * FROM driver_championship';

    try {
        const [result] = await db.query(fetchAllDriverChampionshipsQuery);
        console.log('Driver championships fetched successfully');
        res.status(200).json(result);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching driver championships');
    }
});

// Add new driver championship
app.post('/addDriverChampionship', async (req, res) => {
    const driverChampionshipData = req.body;

    const insertDriverChampionshipQuery = 'INSERT INTO driver_championship SET ?';

    try {
        const [result] = await db.query(insertDriverChampionshipQuery, driverChampionshipData);
        console.log('Driver championship added successfully');
        res.status(200).send('Driver championship added successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error adding driver championship');
    }
});

// Delete driver championship
app.delete('/deleteDriverChampionship/:id', async (req, res) => {
    const driverChampionshipId = req.params.id;

    const deleteDriverChampionshipQuery = 'DELETE FROM driver_championship WHERE dc_id = ?';

    try {
        const [result] = await db.query(deleteDriverChampionshipQuery, [driverChampionshipId]);
        if (result.affectedRows > 0) {
            console.log(`Driver championship with ID ${driverChampionshipId} deleted successfully`);
            res.status(200).send(`Driver championship with ID ${driverChampionshipId} deleted successfully`);
        } else {
            console.log(`Driver championship with ID ${driverChampionshipId} not found`);
            res.status(404).send(`Driver championship with ID ${driverChampionshipId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting driver championship');
    }
});

// Update driver championship
app.put('/updateDriverChampionship/:id', async (req, res) => {
    const driverChampionshipId = req.params.id;
    const updatedDriverChampionshipData = req.body;

    const updateDriverChampionshipQuery = 'UPDATE driver_championship SET ? WHERE dc_id = ?';

    try {
        const [result] = await db.query(updateDriverChampionshipQuery, [updatedDriverChampionshipData, driverChampionshipId]);
        if (result.affectedRows > 0) {
            console.log(`Driver championship with ID ${driverChampionshipId} updated successfully`);
            res.status(200).send(`Driver championship with ID ${driverChampionshipId} updated successfully`);
        } else {
            console.log(`Driver championship with ID ${driverChampionshipId} not found`);
            res.status(404).send(`Driver championship with ID ${driverChampionshipId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating driver championship');
    }
});
// Fetch all results
app.get('/fetchAllResults', async (req, res) => {
    const fetchAllResultsQuery = 'SELECT * FROM results';

    try {
        const [result] = await db.query(fetchAllResultsQuery);
        console.log('Results fetched successfully');
        res.status(200).json(result);
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error fetching results');
    }
});

// Add new result
app.post('/addResult', async (req, res) => {
    const resultData = req.body;

    const insertResultQuery = 'INSERT INTO results SET ?';

    try {
        const [result] = await db.query(insertResultQuery, resultData);
        console.log('Result added successfully');
        res.status(200).send('Result added successfully');
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error adding result');
    }
});

// Delete result
app.delete('/deleteResult/:id', async (req, res) => {
    const resultId = req.params.id;

    const deleteResultQuery = 'DELETE FROM results WHERE d_id = ?';

    try {
        const [result] = await db.query(deleteResultQuery, [resultId]);
        if (result.affectedRows > 0) {
            console.log(`Result with driver ID ${resultId} deleted successfully`);
            res.status(200).send(`Result with driver ID ${resultId} deleted successfully`);
        } else {
            console.log(`Result with driver ID ${resultId} not found`);
            res.status(404).send(`Result with driver ID ${resultId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error deleting result');
    }
});

// Update result
app.put('/updateResult/:id', async (req, res) => {
    const resultId = req.params.id;
    const updatedResultData = req.body;

    const updateResultQuery = 'UPDATE results SET ? WHERE d_id = ?';

    try {
        const [result] = await db.query(updateResultQuery, [updatedResultData, resultId]);
        if (result.affectedRows > 0) {
            console.log(`Result with driver ID ${resultId} updated successfully`);
            res.status(200).send(`Result with driver ID ${resultId} updated successfully`);
        } else {
            console.log(`Result with driver ID ${resultId} not found`);
            res.status(404).send(`Result with driver ID ${resultId} not found`);
        }
    } catch (err) {
        console.error('MySQL query error:', err);
        res.status(500).send('Error updating result');
    }
});


// ... (existing code) ...


app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await createTable();
});
