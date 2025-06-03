import { ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { CarStorage } from '@/storage/CarStorage';
import { Car } from '@/model/Models';
import CarCard from '@/components/CarCard';
import { useIsFocused } from '@react-navigation/core';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { accentColor, primaryColor } from '@/constants/Colors';

export default function CarsScreen() {
    const isFocused = useIsFocused();
    const db = useSQLiteContext();

    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        if (isFocused) {
            CarStorage.getCarsAsync(db).then(setCars);
        }
    }, [isFocused, db]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{
                    marginTop: 4,
                    marginHorizontal: 4,
                }}
                contentContainerStyle={{ rowGap: 8, paddingBottom: 80 }}
            >
                {cars.map((car, index) => (
                    <CarCard key={index} marginVertical={2} car={car} />
                ))}
            </ScrollView>

            <Link href="/AddCarModal" asChild>
                <Pressable style={styles.fab}>
                    <FontAwesome name="plus" size={24} color={primaryColor} />
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: accentColor,
        borderRadius: 32,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
