import { Request, Response } from "express"
import knex from "../database/connection";
class PointsController {
    async show(req: Request, res: Response) {
        const { idPoint } = req.params;
        const point = await knex("points").where("id", idPoint).first();
        if (!point) {
            return res.status(400).json({ message: "point not found" });
        }
        const items = await knex("items")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", idPoint);

        return res.json({ point, items });
    }
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query;
        const parsedItems = String(items)
            .split(",")
            .map(item => Number(item.trim()));

        const points = await knex("points")
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", parsedItems)
            .where("city", String(city))
            .where("uf", String(uf))
            .distinct()
            .select("point.*");

        return res.json(points)


    }

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            phone,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        const trx = await knex.transaction();

        const point = {
            image: "default",
            name,
            email,
            phone,
            latitude,
            longitude,
            city,
            uf,
        };

        const insertedIds = await trx("points").insert(point);

        const point_id = insertedIds[0]

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        });
        await trx("point_items").insert(pointItems);
        await trx.commit();
        return res.json({
            id: point_id,
            ...point,
        });
    }
}
export default PointsController;