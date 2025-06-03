import {SQLiteDatabase} from "expo-sqlite";
import {SimpleParked} from "@/model/Models";

export class ParkedStorage {
    private constructor() {}

    public static async getParkedByIdAsync(db: SQLiteDatabase, id: number): Promise<SimpleParked | null> {
        return ParkedStorage.getParkedById(db, id);
    }

    public static getParkedById(db: SQLiteDatabase, id: number): SimpleParked | null {
        const statement = db.prepareSync("SELECT * FROM parked WHERE id = $id");
        const res = statement.executeSync<SimpleParked>({ $id: id });
        return res.getFirstSync();
    }

    public static async getAllParkedAsync(db: SQLiteDatabase): Promise<SimpleParked[]> {
        return ParkedStorage.getAllParked(db);
    }

    public static getAllParked(db: SQLiteDatabase): SimpleParked[] {
        return db.getAllSync<SimpleParked>("SELECT * FROM parked");
    }

    public static async saveParkedAsync(db: SQLiteDatabase, record: SimpleParked): Promise<void> {
        return ParkedStorage.saveParked(db, record);
    }

    public static saveParked(db: SQLiteDatabase, record: SimpleParked): void {
        if (record.id) {
            const updateStatement = db.prepareSync(`
                UPDATE parked
                SET car_id = $car_id, start = $start, finish = $finish,
                    location_id = $location_id, note = $note
                WHERE id = $id
            `);
            updateStatement.executeSync<SimpleParked>({
                //@ts-ignore
                $id: record.id,
                $car_id: record.carId,
                $start: record.start,
                $finish: record.finish,
                $location_id: record.locationId,
                $note: record.note
            });
            return;
        }

        const insertStatement = db.prepareSync(`
            INSERT INTO parked (car_id, start, finish, location_id, note)
            VALUES ($car_id, $start, $finish, $location_id, $note)
        `);
        insertStatement.executeSync<SimpleParked>({
            //@ts-ignore
            $car_id: record.carId,
            $start: record.start,
            $finish: record.finish,
            $location_id: record.locationId,
            $note: record.note
        });
    }

    public static deleteParkedById(db: SQLiteDatabase, id: number): void {
        const deleteStatement = db.prepareSync("DELETE FROM parked WHERE id = $id");
        deleteStatement.executeSync({ $id: id });
    }
}
