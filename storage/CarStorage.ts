import db from './database'
import {Car} from "@/model/Models";
import {SQLiteDatabase} from "expo-sqlite";

export class CarStorage {
    private constructor() {}


    public static async getCarsAsync(db: SQLiteDatabase): Promise<Car[]> {
        return CarStorage.getCars(db);
    }

    public static getCars(db: SQLiteDatabase): Car[] {
        const cars: Car[] = db.getAllSync("SELECT * FROM car")
        return cars;
    }

    public static saveCar(db: SQLiteDatabase, car: Car): Car {
        if (car.id) {
            // Update existing car
            db.execSync(
                `UPDATE car SET name = ${car.name}, registration_plate_number = ${car.registrationPlateNumber}, color = ${car.color} WHERE id = ${car.id};`
            )
            return car
        }

        const statement = db.prepareSync(
            `INSERT INTO car (name, registration_plate_number, color) VALUES ($name, $plate, $color) RETURNING *;`
        );

        const result = statement.executeSync<Car>({
            //@ts-ignore
            $name: car.name,
            $plate: car.registrationPlateNumber,
            $color: car.color,
        });
        //console.log(result);
        //console.log(result.getAllSync());

        const firstRow = result.getFirstSync();
        return firstRow ?? {};
    }
}