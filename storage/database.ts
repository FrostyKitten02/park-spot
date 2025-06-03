import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('park-spot.db');

export default db;
