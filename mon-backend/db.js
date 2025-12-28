const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "gestionmateriel",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur MySQL :", err);
  } else {
    console.log("Connecté à MySQL");
  }
});

module.exports = db;
