import {View} from '@/components/Themed';
import ParkingCard from "@/components/ParkingCard";
import {Parked} from "@/model/Models";
import CarCard from "@/components/CarCard";
import {useSQLiteContext} from "expo-sqlite";

export default function HomeScreen() {
    const db = useSQLiteContext()
    const car = {
        name: 'MyCar',
        registrationPlateNumber: "MB-HD611"
    }

    const parked: Parked = {
        car: car,
        start: new Date(),
    }

    return (
        <View
            style={{
                marginTop: 4,
                marginHorizontal: 4,
                display: "flex",
                rowGap: 4
            }}
        >
            <ParkingCard parked={parked}/>
            <CarCard car={car}/>
        </View>
    );
}
