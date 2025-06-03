import {ScrollView} from 'react-native';
import {useSQLiteContext} from "expo-sqlite";
import {useEffect, useState} from "react";
import {CarStorage} from "@/storage/CarStorage";
import {Car} from "@/model/Models";
import CarCard from "@/components/CarCard";

export default function CarsScreen() {
    const [cars, setCars] = useState<Car[]>([]);
    const db = useSQLiteContext();

    useEffect(() => {
        console.log("fetching");
        CarStorage.getCarsAsync(db)
            .then(res => setCars(res));
    }, [])


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
