const express = require("express");
const router = express.Router();
const controller = require("../controllers/materiel.controller");

router.get("/", controller.getAllMateriels);
router.get("/disponibles", controller.getMaterielsDisponibles);
router.get("/:id", controller.getMaterielById);
router.post("/", controller.addMateriel);
router.put("/:id", controller.updateMateriel);
router.delete("/:id", controller.deleteMateriel);

module.exports = router;
