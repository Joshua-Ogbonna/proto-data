import { Request, Response, NextFunction } from "express";
import Tile, { ITile } from "../models/Tile";
import { ApiError } from "../utils/ApiError";

export const getTiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, country } = req.query;
    let query = {};

    if (region) query = { ...query, region };
    if (country) query = { ...query, country };

    const tiles = await Tile.find(query);
    res.json(tiles);
  } catch (error) {
    next(error);
  }
};

export const getTileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tile = await Tile.findById(req.params.id);
    if (!tile) throw new ApiError(404, "Tile not found");
    res.json(tile);
  } catch (error) {
    next(error);
  }
};

export const getTilesByBounds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { north, south, east, west } = req.query;

    const tiles = await Tile.find({
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
  } catch (error) {
    next(error);
  }
};
