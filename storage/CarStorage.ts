import db from './database'
import {Car} from "@/model/Models";

export class CarStorage {
    private constructor() {}

    public static getCars(): Car[] {
        const cars: Car[] = db.getAllSync("SELECT * FROM car ORDER BY start desc")
        return cars;
    }
}