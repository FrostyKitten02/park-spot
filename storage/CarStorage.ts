import db from './database'
import {Car} from "@/model/Models";
import {SQLiteDatabase} from "expo-sqlite";

export class CarStorage {
    private constructor() {}

    public static async getCarByIdAsync(db: SQLiteDatabase, id: number): Promise<Car | null> {
        return CarStorage.getCarById(db, id);
    }

    public static getCarById(db: SQLiteDatabase, id: number): Car | null {
        const statment = db.prepareSync('SELECT * FROM car WHERE id = $id')
        const res = statment.executeSync<Car>(
            {
                $id: id,
            }
        )

        return res.getFirstSync();
    }

    public static async getCarsAsync(db: SQLiteDatabase): Promise<Car[]> {
        return CarStorage.getCars(db);
    }

    public static getCars(db: SQLiteDatabase): Car[] {
        const cars: Car[] = db.getAllSync("SELECT * FROM car")
        return cars;
    }

    public static async saveCarSync(db: SQLiteDatabase, car: Car): Promise<void> {
        return CarStorage.saveCar(db, car);
    }

    public static saveCar(db: SQLiteDatabase, car: Car) {
        if (car.id) {
            // Update existing car
            const updateStatment = db.prepareSync(`UPDATE car SET name = $name, registrationPlateNumber = $plate, color = $color WHERE id = $id;`)
            const result = updateStatment.executeSync<Car>({
                //@ts-ignore
                $id: car.id,
                $name: car.name,
                $plate: car.registrationPlateNumber,
                $color: car.color,
            });

            return
        }

        const statement = db.prepareSync(
            `INSERT INTO car (name, registrationPlateNumber, color) VALUES ($name, $plate, $color) RETURNING *;`
        );

        const result = statement.executeSync<Car>({
            //@ts-ignore
            $name: car.name,
            $plate: car.registrationPlateNumber,
            $color: car.color,
        });
    }
}