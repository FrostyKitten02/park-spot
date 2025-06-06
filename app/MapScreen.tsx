import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useLocalSearchParams} from "expo-router";
import * as Location from 'expo-location';
import {View} from "@/components/Themed";
import {Parked} from "@/model/Models";
import {useSQLiteContext} from "expo-sqlite";
import {ParkedStorage} from "@/storage/ParkedStorage";
import ParkingCard from "@/components/ParkingCard";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function MapScreen() {
    const {latitude, longitude, parkedId} = useLocalSearchParams<{ latitude: string, longitude: string, parkedId: string }>();
    const [parked, setParked] = useState<Parked | undefined>()
    const db = useSQLiteContext();

    useEffect(() => {
        Location.requestForegroundPermissionsAsync()
            .then(res => {
                //do we do anything here??
            });

        if (parkedId == undefined) {
            return;
        }

        ParkedStorage.getParkedByIdFullAsync(db, Number(parkedId))
            .then(res => {
                setParked(res);
            })
    }, []);



    const latitudeNum = Number(latitude);
    const longitudeNum = Number(longitude);
    return (
        <GestureHandlerRootView style={styles.container}>
            <MapView
                followsUserLocation={true}
                loadingEnabled={true}
                userLocationUpdateInterval={600}
                style={styles.map}
                showsUserLocation={true}
                initialRegion={{
                    latitude: latitudeNum,
                    longitude: longitudeNum,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: latitudeNum,
                        longitude: longitudeNum,
                    }}
                    title="TITLE"
                />
            </MapView>

            {/* Bottom Overlay */}
            {!parked?
                null:
                <View style={styles.bottomOverlay}>
                    <ParkingCard
                        parked={parked}
                        marginVertical={0}
                        viewOnly={true}
                    />
                </View>
                }
        </GestureHandlerRootView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        alignItems: 'center',
    },
    overlayText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
