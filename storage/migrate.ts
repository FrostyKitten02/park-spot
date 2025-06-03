import {migrations} from '@/storage/migrations';
import {SQLiteDatabase} from "expo-sqlite";

const MIGRATIONS_TABLE = '__migrations';

export const runMigrations = (db: SQLiteDatabase) => {
    db.execSync(`CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE}
                 (
                     id
                     INTEGER
                     PRIMARY
                     KEY
                     AUTOINCREMENT,
                     migration_id
                     INTEGER
                     not
                     null
                 );`);
    for (const migration of migrations) {
        const migrationDb = db.getFirstSync(
            `SELECT * FROM ${MIGRATIONS_TABLE} WHERE migration_id = ?;`,
            [migration.id]
        );

        if (migrationDb) {
            continue;
        }
        db.withTransactionSync(() => {
            db.execSync(migration.sql);
            db.execSync(`INSERT INTO ${MIGRATIONS_TABLE} (migration_id)
                         VALUES (${migration.id});`)
        })
    }
};
