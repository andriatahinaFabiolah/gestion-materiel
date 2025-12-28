const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/materiels", require("./routes/materiel.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/directions", require("./routes/direction.routes"));
app.use("/api/portes", require("./routes/porte.routes"));
app.use("/api/affectations", require("./routes/affectation.routes"));

app.listen(5000, () => {
  console.log("Backend lancé sur http://localhost:5000");
});
