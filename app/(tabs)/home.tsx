import {Button, ScrollView, StyleSheet, View} from 'react-native';
import {useSQLiteContext} from 'expo-sqlite';
import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/core';
import {GestureHandlerRootView} from "react-native-gesture-handler";

import {Parked} from '@/model/Models';
import {ParkedStorage} from '@/storage/ParkedStorage';
import FloatingButton from '@/components/FloatingButton';
import ParkingCard from '@/components/ParkingCard';
import {useRouter} from "expo-router";

export default function ParkedScreen() {
    const db = useSQLiteContext();
    const isFocused = useIsFocused();
    const router = useRouter();

    const [parkedList, setParkedList] = useState<Parked[]>([]);

    useEffect(() => {
        if (isFocused) {
            fetchParkedList();
        }
    }, [isFocused, db]);

    function fetchParkedList() {
        ParkedStorage.getAllParkedFullAsync(db)
            .then(data => {
                setParkedList(data);
            });
    }

    return (
        <GestureHandlerRootView>
            <View style={{flex: 1}}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                >
                    {parkedList.map((item, index) => (
                        <ParkingCard
                            key={index}
                            parked={item}
                            marginVertical={0}
                            onDelete={fetchParkedList}
                        />
                    ))}
                </ScrollView>

                <FloatingButton link="/AddParkedModal"/>
            </View>
        </GestureHandlerRootView>
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
