import {Migration} from "@/storage/migrations/index";

const m3: Migration = {
    id: 3,
    description: "Create Parked table",
    sql: `
    CREATE TABLE IF NOT EXISTS parked (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carId INTEGER,
      start TEXT,
      finish TEXT,
      locationId INTEGER,
      note TEXT,
      FOREIGN KEY (carId) REFERENCES car(id),
      FOREIGN KEY (locationId) REFERENCES location(id)
    );
  `
};

export default m3;
