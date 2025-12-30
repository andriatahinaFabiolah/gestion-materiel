const db = require("../db");

// LISTE DES MATÉRIELS
exports.getAllMateriels = (req, res) => {
  const sql = `
    SELECT 
      m.idmat,
      m.nomMat,
      m.marque,
      m.etat,
      c.nomcat,
      CASE 
        WHEN COUNT(a.idmat) > 0 THEN 1
        ELSE 0
      END AS isAffecte
    FROM materiel m
    JOIN category c ON m.idcat = c.idcat
    LEFT JOIN affectation a ON m.idmat = a.idmat AND a.dateDesaff IS NULL
    GROUP BY m.idmat, m.nomMat, m.marque, m.etat, c.nomcat
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.getMaterielsDisponibles = (req, res) => {
  const sql = `
    SELECT m.idmat, m.nomMat, m.marque
    FROM materiel m
    WHERE m.idmat NOT IN (
      SELECT a.idmat
      FROM affectation a
      WHERE a.dateDesaff IS NULL
    )
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// AJOUTER UN MATÉRIEL
exports.addMateriel = (req, res) => {
  const { nomMat, marque, etat, idcat } = req.body;
  const sql = "INSERT INTO materiel (nomMat, marque, etat, idcat) VALUES (?,?,?,?)";
  db.query(sql, [nomMat, marque, etat, idcat], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Matériel ajouté avec succès" });
  });
};

// SUPPRIMER UN MATERIEL
exports.deleteMateriel = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM materiel WHERE idmat = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Matériel supprimé" });
  });
};

// RECUPERER UN MATERIEL PAR ID
exports.getMaterielById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT idmat, nomMat, marque, etat, idcat
    FROM materiel
    WHERE idmat = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// MODIFIER UN MATERIEL
exports.updateMateriel = (req, res) => {
  const { id } = req.params;
  const { nomMat, marque, etat, idcat } = req.body;

  const sql = `
    UPDATE materiel
    SET nomMat = ?, marque = ?, etat = ?, idcat = ?
    WHERE idmat = ?
  `;
  db.query(sql, [nomMat, marque, etat, idcat, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Matériel modifié" });
  });
};

