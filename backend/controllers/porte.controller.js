const db = require("../db");

// 📌 GET ALL
exports.getAllPortes = (req, res) => {
  const sql = `
    SELECT p.idport, p.numero, d.nomdir
    FROM porte p
    JOIN direction d ON p.iddir = d.iddir
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// 🔹 Portes par direction
exports.getPortesByDirection = (req, res) => {
  const { iddir } = req.params;
  const sql = `
    SELECT p.idport, p.numero
    FROM porte p
    WHERE p.iddir = ?
  `;
  db.query(sql, [iddir], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ➕ POST
exports.addPorte = (req, res) => {
  const { numero, iddir } = req.body;

  db.query(
    "INSERT INTO porte (numero, iddir) VALUES (?, ?)",
    [numero, iddir],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Porte ajoutée" });
    }
  );
};

// ✏️ PUT
exports.updatePorte = (req, res) => {
  const { id } = req.params;
  const { numero, iddir } = req.body;

  db.query(
    "UPDATE porte SET numero=?, iddir=? WHERE idport=?",
    [numero, iddir, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Porte modifiée" });
    }
  );
};

// 🗑️ DELETE
exports.deletePorte = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM porte WHERE idport=?",
    [id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Porte supprimée" });
    }
  );
};
