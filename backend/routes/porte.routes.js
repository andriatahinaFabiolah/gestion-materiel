const express = require("express");
const router = express.Router();
const controller = require("../controllers/porte.controller");

router.get("/", controller.getAllPortes);
router.post("/", controller.addPorte);
router.put("/:id", controller.updatePorte);
router.delete("/:id", controller.deletePorte);

router.get("/direction/:iddir", controller.getPortesByDirection);

module.exports = router;
