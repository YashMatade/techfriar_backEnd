const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectionDB } = require("./db/connection");
const indexRoutes = require("./routes/index.routes");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", indexRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectionDB();
let port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${5000}`);
});