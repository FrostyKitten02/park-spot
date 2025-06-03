import {ScrollView} from 'react-native';
import {useSQLiteContext} from "expo-sqlite";
import {useEffect, useState} from "react";
import {CarStorage} from "@/storage/CarStorage";
import {Car} from "@/model/Models";
import CarCard from "@/components/CarCard";
import {useIsFocused} from "@react-navigation/core";

export default function CarsScreen() {
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const [cars, setCars] = useState<Car[]>([]);

    // const car: Car = {
    //     name: "SUPER CAR",
    //     registrationPlateNumber: "asdasd",
    //     color: "asdasd"
    // };
    // console.log("car", car);
    // const saved = CarStorage.saveCar(db, car);
    // console.log(saved);

    useEffect(() => {
        if (isFocused) {
            CarStorage.getCarsAsync(db).then(setCars);
        }
    }, [isFocused, db]);


    return (
        <ScrollView
            style={{
                marginTop: 4,
                marginHorizontal: 4,
                display: "flex",
                rowGap: 4
            }}
        >
            {cars.map((car) => (
                //TODO key!!!
                <CarCard
                    marginVertical={2}
                    car={car} />
            ))}

        </ScrollView>
    );
}
