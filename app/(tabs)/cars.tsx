import {ScrollView, View} from 'react-native';
import {useSQLiteContext} from 'expo-sqlite';
import {useEffect, useState} from 'react';
import {CarStorage} from '@/storage/CarStorage';
import {Car} from '@/model/Models';
import CarCard from '@/components/CarCard';
import {useIsFocused} from '@react-navigation/core';
import FloatingButton from "@/components/FloatingButton";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function CarsScreen() {
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        if (isFocused) {
            fetchCars();
        }
    }, [isFocused, db]);

    function fetchCars() {
        CarStorage.getCarsAsync(db).then(setCars);
    }

    return (
        <GestureHandlerRootView>
            <View style={{flex: 1}}>
                <ScrollView
                    style={{
                        marginTop: 4,
                        marginHorizontal: 4,
                    }}
                    contentContainerStyle={{rowGap: 8, paddingBottom: 80}}
                >
                    {cars.map((car, index) => (
                        <CarCard
                            key={index}
                            marginVertical={0}
                            car={car}
                            onDelete={fetchCars}
                        />
                    ))}
                </ScrollView>

                <FloatingButton
                    link="/AddCarModal"
                />
            </View>
        </GestureHandlerRootView>
    );
}
