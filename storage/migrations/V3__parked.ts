import {Migration} from "@/storage/migrations/index";

const m3: Migration = {
    id: 3,
    description: "Create Parked table",
    sql: `
    CREATE TABLE IF NOT EXISTS parked (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car_id INTEGER NOT NULL,
      start TEXT,
      finish TEXT,
      location_id INTEGER,
      note TEXT,
      FOREIGN KEY (car_id) REFERENCES car(id),
      FOREIGN KEY (location_id) REFERENCES location(id)
    );
  `
};

export default m3;
