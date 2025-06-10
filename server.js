const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data', 'drinks.json');

app.get('/api/teams', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile));
    res.json(data.teams);
});

app.post('/api/add-drink', (req, res) => {
    const { teamId, amount } = req.body;

    const drinkAmount = Number.isInteger(amount) && amount > 0 ? amount : 1;

    const data = JSON.parse(fs.readFileSync(dataFile));
    const team = data.teams.find(t => t.id === teamId);

    if (team) {
        team.drinks += drinkAmount;
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        res.json({ success: true, team });
    } else {
        res.status(404).json({ success: false, message: "Team nicht gefunden" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ App läuft unter http://localhost:${PORT}`);
});
