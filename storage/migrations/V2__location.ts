import {Migration} from "@/storage/migrations/index";

const m2: Migration = {
    id: 2,
    description: "Create Location table",
    sql: `
    CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      longitude TEXT,
      latitude TEXT
    );
  `
};

export default m2;