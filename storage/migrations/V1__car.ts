import {Migration} from "@/storage/migrations/index";

const m1: Migration = {
    id: 1,
    description: "Car table",
    sql: "CREATE TABLE car(" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name TEXT, " +
        "registrationPlateNumber TEXT, " +
        "color TEXT" +
        ");"
}



export default m1;