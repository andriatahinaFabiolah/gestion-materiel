const db = require("../db");

/* =====================================================
   📋 Liste des affectations ACTIVES
   ===================================================== */
exports.getAllAffectations = (req, res) => {
  const sql = `
    SELECT 
      a.idaff,
      a.idmat, 
      a.dateAff,
      m.nomMat,
      m.marque,
      p.numero AS porte,
      d.nomdir
    FROM affectation a
    JOIN materiel m ON a.idmat = m.idmat
    JOIN porte p ON a.idport = p.idport
    JOIN direction d ON p.iddir = d.iddir
    WHERE a.dateDesaff IS NULL
    ORDER BY a.dateAff DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

/* =====================================================
   ➕ Ajouter une affectation
   ===================================================== */
exports.addAffectation = (req, res) => {
  const { idmat, idport } = req.body;

  if (!idmat || !idport) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  // 🔍 Vérifier si le matériel est déjà affecté (n'importe où)
  const checkSql = `
    SELECT * FROM affectation
    WHERE idmat = ? AND dateDesaff IS NULL
  `;

  db.query(checkSql, [idmat], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({
        message: "Ce matériel est déjà affecté"
      });
    }

    // ➕ Insérer affectation
    const insertSql = `
      INSERT INTO affectation (dateAff, idmat, idport)
      VALUES (NOW(), ?, ?)
    `;

    db.query(insertSql, [idmat, idport], err2 => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: "Affectation ajoutée avec succès" });
    });
  });
};

/* =====================================================
   🔁 Désaffecter (historique conservé)
   ===================================================== */
exports.desaffecter = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE affectation
    SET dateDesaff = NOW()
    WHERE idaff = ? AND dateDesaff IS NULL
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Affectation introuvable ou déjà désaffectée"
      });
    }

    res.json({ message: "Matériel désaffecté avec succès" });
  });
};

/* =====================================================
   📜 Historique des affectations
   ===================================================== */
exports.getHistoriqueAffectations = (req, res) => {
  const sql = `
    SELECT 
      a.idaff,
      a.dateAff,
      a.dateDesaff,
      m.nomMat,
      m.marque,
      p.numero AS porte,
      d.nomdir
    FROM affectation a
    JOIN materiel m ON a.idmat = m.idmat
    JOIN porte p ON a.idport = p.idport
    JOIN direction d ON p.iddir = d.iddir
    ORDER BY a.dateAff DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
