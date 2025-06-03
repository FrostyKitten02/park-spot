import { SQLiteDatabase } from "expo-sqlite";
import { Location } from "@/model/Models";

export class LocationStorage {
    private constructor() {}

    public static async getLocationByIdAsync(db: SQLiteDatabase, id: number): Promise<Location | null> {
        return LocationStorage.getLocationById(db, id);
    }

    public static getLocationById(db: SQLiteDatabase, id: number): Location | null {
        const statement = db.prepareSync("SELECT * FROM location WHERE id = $id");
        const res = statement.executeSync<Location>({ $id: id });
        return res.getFirstSync();
    }

    public static async getLocationsAsync(db: SQLiteDatabase): Promise<Location[]> {
        return LocationStorage.getLocations(db);
    }

    public static getLocations(db: SQLiteDatabase): Location[] {
        return db.getAllSync<Location>("SELECT * FROM location");
    }

    public static async saveLocationAsync(db: SQLiteDatabase, location: Location): Promise<number> {
        return LocationStorage.saveLocation(db, location);
    }

    public static saveLocation(db: SQLiteDatabase, location: Location): number {
        if (location.id) {
            const updateStatement = db.prepareSync(`
                UPDATE location
                SET longitude = $longitude, latitude = $latitude
                WHERE id = $id
            `);
            const res = updateStatement.executeSync<Location>({
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
        const res = insertStatement.executeSync<Location>({
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
