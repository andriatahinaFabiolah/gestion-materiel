const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");

router.get("/", controller.getAllCategories);
router.post("/", controller.addCategory);
router.delete("/:id", controller.deleteCategory);
router.put("/:id", controller.updateCategory);

module.exports = router;
