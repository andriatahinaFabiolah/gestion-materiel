const express = require("express");
const router = express.Router();
const controller = require("../controllers/direction.controller");

router.get("/", controller.getAllDirections);
router.post("/", controller.addDirection);
router.put("/:id", controller.updateDirection);
router.delete("/:id", controller.deleteDirection);

module.exports = router;
