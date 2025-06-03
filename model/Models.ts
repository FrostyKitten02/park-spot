export interface Car {
    id?: number,
    name?: string,
    registrationPlateNumber?: string,
    color?: string, //TODO???
}

export interface Parked {
    id?: number,
    car?: Car,
    start?: Date,
    finish?: Date,
    location?: Location,
    note?: string,
}

export interface SimpleParked {
    id?: number,
    carId?: number,
    start?: Date,
    finish?: Date,
    locationId?: number,
    note?: string,
}

export interface Location {
    id?: number,
    longitude?: string,
    latitude?: string,
}