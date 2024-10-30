"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tileController_1 = require("../controllers/tileController");
const router = (0, express_1.Router)();
router.get("/", tileController_1.getTiles);
router.get("/bounds", tileController_1.getTilesByBounds);
router.get("/:id", tileController_1.getTileById);
exports.default = router;
