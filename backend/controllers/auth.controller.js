const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔑 Clé secrète pour JWT
const JWT_SECRET = "votre_cle_secrete"; // 🔹 Changez par une clé forte

// =========================
// ➕ Inscription
// =========================
exports.register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    // Vérifier si l'email existe déjà
    const [userExists] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer dans la base
    await db.promise().query(
      "INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword]
    );

    res.json({ message: "Inscription réussie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =========================
// 🔑 Login
// =========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    // Vérifier l'utilisateur
    const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
