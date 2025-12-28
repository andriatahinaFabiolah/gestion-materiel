const express = require("express");
const router = express.Router();
const controller = require("../controllers/affectation.controller");

router.get("/", controller.getAllAffectations);              
router.get("/historique", controller.getHistoriqueAffectations);
router.post("/", controller.addAffectation);
router.put("/desaffecter/:id", controller.desaffecter);

module.exports = router;
