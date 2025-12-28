const db = require("../db");

// Liste
exports.getAllDirections = (req, res) => {
  db.query("SELECT * FROM direction", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Ajout
exports.addDirection = (req, res) => {
  const { nomdir } = req.body;
  if (!nomdir)
    return res.status(400).json({ message: "Nom direction obligatoire" });

  db.query(
    "INSERT INTO direction (nomdir) VALUES (?)",
    [nomdir],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Direction ajoutée" });
    }
  );
};

// Modification
exports.updateDirection = (req, res) => {
  const { id } = req.params;
  const { nomdir } = req.body;

  db.query(
    "UPDATE direction SET nomdir=? WHERE iddir=?",
    [nomdir, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Direction modifiée" });
    }
  );
};

// Suppression
exports.deleteDirection = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM direction WHERE iddir=?",
    [id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Direction supprimée" });
    }
  );
};
