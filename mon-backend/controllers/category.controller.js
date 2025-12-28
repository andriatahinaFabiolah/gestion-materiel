const db = require("../db");

// LISTE
exports.getAllCategories = (req, res) => {
  db.query("SELECT * FROM category", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// AJOUT
exports.addCategory = (req, res) => {
  const { nomcat } = req.body;
  if (!nomcat) {
    return res.status(400).json({ message: "Nom catégorie obligatoire" });
  }

  db.query(
    "INSERT INTO category (nomcat) VALUES (?)",
    [nomcat],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Catégorie ajoutée" });
    }
  );
};

// SUPPRESSION
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM category WHERE idcat = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Catégorie supprimée" });
  });
};

// MODIFICATION
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { nomcat } = req.body;

  db.query(
    "UPDATE category SET nomcat=? WHERE idcat=?",
    [nomcat, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Catégorie modifiée" });
    }
  );
};
