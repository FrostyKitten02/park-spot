import { SQLiteDatabase } from "expo-sqlite";
import { LocationDb } from "@/model/Models";

export class LocationStorage {
    private constructor() {}

    public static async getLocationByIdAsync(db: SQLiteDatabase, id: number): Promise<LocationDb | undefined> {
        return LocationStorage.getLocationById(db, id);
    }

    public static getLocationById(db: SQLiteDatabase, id: number): LocationDb | undefined {
        const statement = db.prepareSync("SELECT * FROM location WHERE id = $id");
        const res = statement.executeSync<LocationDb>({ $id: id });
        return res.getFirstSync()??undefined;
    }

    public static async getLocationsAsync(db: SQLiteDatabase): Promise<LocationDb[]> {
        return LocationStorage.getLocations(db);
    }

    public static getLocations(db: SQLiteDatabase): LocationDb[] {
        return db.getAllSync<LocationDb>("SELECT * FROM location");
    }

    public static async saveLocationAsync(db: SQLiteDatabase, location: LocationDb): Promise<number> {
        return LocationStorage.saveLocation(db, location);
    }

    public static saveLocation(db: SQLiteDatabase, location: LocationDb): number {
        if (location.id) {
            const updateStatement = db.prepareSync(`
                UPDATE location
                SET longitude = $longitude, latitude = $latitude
                WHERE id = $id
            `);
            const res = updateStatement.executeSync<LocationDb>({
                //@ts-ignore
                $id: location.id,
                $longitude: location.longitude,
                $latitude: location.latitude,
            });
            return res.lastInsertRowId;
        }

        const insertStatement = db.prepareSync(`
            INSERT INTO location (longitude, latitude)
            VALUES ($longitude, $latitude)
        `);
        const res = insertStatement.executeSync<LocationDb>({
            //@ts-ignore
            $longitude: location.longitude,
            $latitude: location.latitude,
        });

        return res.lastInsertRowId;
    }

    public static deleteLocationById(db: SQLiteDatabase, id: number): void {
        const deleteStatement = db.prepareSync("DELETE FROM location WHERE id = $id");
        deleteStatement.executeSync({ $id: id });
    }
}
