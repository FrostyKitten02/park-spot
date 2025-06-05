//TODO make database models and ui models separate

export interface Car {
    id?: number,
    name?: string,
    registrationPlateNumber?: string,
    color?: string,
}

export interface CarDb {
    id?: number,
    name?: string,
    registrationPlateNumber?: string,
    color?: string,
}

export interface Parked {
    id?: number,
    car?: Car,
    start?: Date,
    finish?: Date,
    location?: Location,
    note?: string,
}

export interface ParkedDb {
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

export interface LocationDb {
    id?: number,
    longitude?: string,
    latitude?: string,
}