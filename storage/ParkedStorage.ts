import {SQLiteDatabase} from "expo-sqlite";
import {Parked, ParkedDb} from "@/model/Models";
import {LocationStorage} from "@/storage/LocationStorage";
import {CarStorage} from "@/storage/CarStorage";
import {StorageUtil} from "@/util/StorageUtil";
import ParkedScreen from "@/app/(tabs)/home";

interface ParkedRaw {
    id?: number,
    carId?: number,
    start?: string,
    finish?: string,
    locationId?: number,
    note?: string,
}


//TODO convert dates from database to date object!!!
export class ParkedStorage {
    private constructor() {
    }

    public static async getParkedByIdAsync(db: SQLiteDatabase, id: number): Promise<ParkedDb | null> {
        return ParkedStorage.getParkedById(db, id);
    }

    public static getParkedById(db: SQLiteDatabase, id: number): ParkedDb | null {
        const statement = db.prepareSync("SELECT * FROM parked WHERE id = $id");
        const res = statement.executeSync<ParkedRaw>({$id: id});
        const raw = res.getFirstSync();
        return ParkedStorage.mapRawToDb(raw);
    }

    public static async getAllParkedAsync(db: SQLiteDatabase): Promise<ParkedDb[]> {
        return ParkedStorage.getAllParked(db);
    }

    public static getAllParked(db: SQLiteDatabase): ParkedDb[] {
        return db.getAllSync<ParkedRaw>("SELECT * FROM parked ORDER BY start DESC")
            .map(p => {
                return {
                    id: p.id,
                    carId: p.carId,
                    start: StorageUtil.parseSQLiteDate(p.start),
                    finish: StorageUtil.parseSQLiteDate(p.finish),
                    locationId: p.locationId,
                    note: p.note,
                } satisfies ParkedDb
            });
    }

    public static async getParkedByIdFullAsync(db: SQLiteDatabase, id: number): Promise<ParkedDb | undefined> {
        return ParkedStorage.getParkedByIdFull(db, id)
    }

    public static async getParkedByIdFull(db: SQLiteDatabase, id: number): Promise<Parked | undefined> {
        const parked = ParkedStorage.getParkedById(db, id);

        if (!parked) {
            return undefined;
        }

        return ParkedStorage.mapDbToFull(parked, db)??undefined;
    }


    //TODO move to service!!!
    public static async getAllParkedFullAsync(db: SQLiteDatabase): Promise<Parked[]> {
        return ParkedStorage.getAllParkedFull(db);
    }

    //TODO move to service!!!
    public static getAllParkedFull(db: SQLiteDatabase): Parked[] {
        const res = ParkedStorage.getAllParked(db);
        return res.map((parked: ParkedDb) => {
            return ParkedStorage.mapDbToFull(parked, db)!;
        })
    }

    public static async saveParkedAsync(db: SQLiteDatabase, record: ParkedDb): Promise<void> {
        return ParkedStorage.saveParked(db, record);
    }

    public static saveParked(db: SQLiteDatabase, record: ParkedDb): void {
        if (record.id) {
            const updateStatement = db.prepareSync(`
                UPDATE parked
                SET carId      = $car_id,
                    start      = $start,
                    finish     = $finish,
                    locationId = $location_id,
                    note       = $note
                WHERE id = $id
            `);
            updateStatement.executeSync<ParkedRaw>({
                //@ts-ignore
                $id: record.id,
                $car_id: record.carId,
                $start: StorageUtil.formatDateForSQLite(record.start),
                $finish: StorageUtil.formatDateForSQLite(record.finish),
                $location_id: record.locationId,
                $note: record.note
            });
            return;
        }

        const insertStatement = db.prepareSync(`
            INSERT INTO parked (carId, start, finish, locationId, note)
            VALUES ($car_id, $start, $finish, $location_id, $note)
        `);

        insertStatement.executeSync<ParkedRaw>({
            //@ts-ignore
            $car_id: record.carId,
            $start: StorageUtil.formatDateForSQLite(record.start),
            $finish: StorageUtil.formatDateForSQLite(record.finish),
            $location_id: record.locationId,
            $note: record.note
        });
    }

    public static deleteParkedById(db: SQLiteDatabase, id: number): void {
        const deleteStatement = db.prepareSync("DELETE FROM parked WHERE id = $id");
        deleteStatement.executeSync({$id: id});
    }

    private static mapRawToDb(parked: ParkedRaw | null): ParkedDb | null {
        if (!parked) {
            return null;
        }

        return {
            id: parked.id,
            start: StorageUtil.parseSQLiteDate(parked.start),
            finish: StorageUtil.parseSQLiteDate(parked.finish),
            note: parked.note,
            locationId: parked.locationId,
            carId: parked.carId,
        }
    }

    private static mapDbToFull(parked: ParkedDb | null, db: SQLiteDatabase): Parked | null {
        if (!parked) {
            return null;
        }

        return {
            id: parked.id,
            start: parked.start,
            finish: parked.finish,
            note: parked.note,
            location: parked.locationId ? LocationStorage.getLocationById(db, parked.locationId) : undefined,
            car: parked.carId ? CarStorage.getCarById(db, parked.carId) : undefined
        }
    }
}
