import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, {Marker, MapPressEvent, Region} from 'react-native-maps';
import StyledTextInput from './StyledTextInput';
import {accentColor, primaryColor} from '@/constants/Colors';
import {LatLng} from "react-native-maps/lib/sharedTypes";

interface LocationPickerModalProps {
    visible: boolean;
    latitude: string;
    longitude: string;
    onChange: (region: LatLng) => void;
    onSave: () => void;
    onCancel: () => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
                                                                     visible,
                                                                     latitude,
                                                                     longitude,
                                                                     onChange,
                                                                     onSave,
                                                                     onCancel,
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
            onRequestClose={onCancel}
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
                        <Pressable style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.saveButton} onPress={onSave}>
                            <Text style={styles.saveText}>Save</Text>
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
        marginTop: 16,
    },
    saveButton: {
        padding: 10,
        backgroundColor: accentColor,
        borderRadius: 6,
    },
    saveText: {
        color: primaryColor,
        fontWeight: '600',
    },
    cancelButton: {
        padding: 10,
        backgroundColor: '#aaa',
        borderRadius: 6,
    },
    cancelText: {
        color: 'white',
    },
});

export default LocationPickerModal;
