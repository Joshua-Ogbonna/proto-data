"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tileRoutes_1 = __importDefault(require("./tileRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const dataRequestRoutes_1 = __importDefault(require("./dataRequestRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const router = (0, express_1.Router)();
router.use('/tiles', tileRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
router.use('/dataset-requests', dataRequestRoutes_1.default);
router.use("/auth", authRoutes_1.default);
router.use('/payments', paymentRoutes_1.default);
exports.default = router;
