import { ScrollView, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { Parked } from '@/model/Models';
import { ParkedStorage } from '@/storage/ParkedStorage';
import FloatingButton from '@/components/FloatingButton';
import ParkingCard from '@/components/ParkingCard'; // You need to create this

export default function ParkedScreen() {
    const db = useSQLiteContext();
    const isFocused = useIsFocused();

    const [parkedList, setParkedList] = useState<Parked[]>([]);

    useEffect(() => {
        if (isFocused) {
            ParkedStorage.getAllParkedFullAsync(db)
                .then(data => {
                    setParkedList(data);
                });
        }
    }, [isFocused, db]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
            >
                {parkedList.map((item, index) => (
                    <ParkingCard key={index} parked={item} marginVertical={4}/>
                ))}
            </ScrollView>

            <FloatingButton link="/AddParkedModal" />
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: {
        marginTop: 4,
        marginHorizontal: 4,
    },
    content: {
        rowGap: 8,
        paddingBottom: 80,
    },
});
