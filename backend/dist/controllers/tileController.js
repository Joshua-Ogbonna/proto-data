"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTilesByBounds = exports.getTileById = exports.getTiles = void 0;
const Tile_1 = __importDefault(require("../models/Tile"));
const ApiError_1 = require("../utils/ApiError");
const getTiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { region, country } = req.query;
        let query = {};
        if (region)
            query = Object.assign(Object.assign({}, query), { region });
        if (country)
            query = Object.assign(Object.assign({}, query), { country });
        const tiles = yield Tile_1.default.find(query);
        res.json(tiles);
    }
    catch (error) {
        next(error);
    }
});
exports.getTiles = getTiles;
const getTileById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tile = yield Tile_1.default.findById(req.params.id);
        if (!tile)
            throw new ApiError_1.ApiError(404, "Tile not found");
        res.json(tile);
    }
    catch (error) {
        next(error);
    }
});
exports.getTileById = getTileById;
const getTilesByBounds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { north, south, east, west } = req.query;
        const tiles = yield Tile_1.default.find({
            coordinates: {
                $geoWithin: {
                    $box: [
                        [Number(west), Number(south)],
                        [Number(east), Number(north)],
                    ],
                },
            },
        });
        res.json(tiles);
    }
    catch (error) {
        next(error);
    }
});
exports.getTilesByBounds = getTilesByBounds;
