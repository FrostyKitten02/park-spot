import React from 'react';
import {Dimensions, Modal, Pressable, StyleSheet, View} from 'react-native';
import MapView, {MapPressEvent, Marker} from 'react-native-maps';
import {accentColor, primaryColor} from '@/constants/Colors';
import {LatLng} from "react-native-maps/lib/sharedTypes";
import {Text} from "@/components/Themed";

interface LocationPickerModalProps {
    visible: boolean;
    latitude: string;
    longitude: string;
    onChange: (region: LatLng) => void;
    onExit: () => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
                                                                     visible,
                                                                     latitude,
                                                                     longitude,
                                                                     onChange,
                                                                     onExit,
                                                                 }) => {
    const lat = parseFloat(latitude) || 0;
    const lon = parseFloat(longitude) || 0;

    const handleMapPress = (event: MapPressEvent) => {
        const region = event.nativeEvent.coordinate;
        onChange(region)
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onExit}
        >
            <View style={styles.backdrop}>
                <View style={styles.modalContainer}>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={StyleSheet.absoluteFill}
                            zoomTapEnabled={false}
                            initialRegion={{
                                latitude: lat || 0,
                                longitude: lon || 0,
                                latitudeDelta: 0.00005,
                                longitudeDelta: 0.00005,
                            }}
                            onPress={handleMapPress}
                        >
                            <Marker coordinate={{latitude: lat, longitude: lon}}/>
                        </MapView>
                    </View>

                    <View style={styles.buttonRow}>
                        <Pressable style={styles.saveButton} onPress={onExit}>
                            <Text style={styles.saveText}>Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: primaryColor,
        borderRadius: 8,
        padding: 16,
        maxHeight: '90%',
    },
    mapContainer: {
        height: Dimensions.get('window').height * 0.7,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: '100%',
        marginTop: 16,
    },
    saveButton: {
        padding: 10,
        backgroundColor: accentColor,
        minWidth: '100%',
        borderRadius: 6,
    },
    saveText: {
        color: primaryColor,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default LocationPickerModal;
