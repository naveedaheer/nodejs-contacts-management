
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const db = require("./models/index");
const contact = require("./routes/contactRoutes")
const app = express();

const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/contact', contact)
app.get('/',(req,res) =>{
    res.send("App is running")
})
db.sequelize.sync()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Failed to connect with DB" + err.message);
    });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});