import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StyledPicker from '@/components/StyledPicker';
import { CarStorage } from '@/storage/CarStorage';
import { Car } from '@/model/Models';
import { accentColor, primaryColor } from '@/constants/Colors';
import {useSettings} from "@/context/SettingsContext";
import {useIsFocused} from "@react-navigation/core";
import {SettingsStorage} from "@/storage/SettingsStorage";

export default function SettingsScreen() {
    const db = useSQLiteContext();
    const isFocused = useIsFocused();

    const settings = useSettings();

    const [cars, setCars] = useState<Car[]>([]);
    const [defaultCarId, setDefaultCarId] = useState<number | undefined>();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isFocused) {
            setDefaultCarId(settings.defaultCarId);
        }
    }, [isFocused, settings]);

    useEffect(() => {
        if (isFocused) {
            fetchCars();
            setDefaultCarId(settings.defaultCarId)
        }
    }, [isFocused, db]);

    function fetchCars() {
        CarStorage.getCarsAsync(db)
            .then(setCars);
    }

    const saveDefaultCar = async () => {
        try {
            setIsSaving(true);
            await settings.setDefaultCarId(defaultCarId);
            Alert.alert('Success', 'Default car saved.');
        } catch (error) {
            Alert.alert('Error', 'Failed to save default car.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <StyledPicker
                    label="Default Car"
                    selectedValue={defaultCarId}
                    onValueChange={setDefaultCarId}
                    enabled={!isSaving}
                    options={[
                        { label: 'Select a car...', value: undefined },
                        ...cars.map((car) => ({ label: car.name ?? '', value: car.id })),
                    ]}
                />

                <View style={styles.buttonContainer}>
                    <Pressable
                        onPress={saveDefaultCar}
                        disabled={isSaving}
                        style={({ pressed }) => [
                            styles.button,
                            { backgroundColor: pressed ? '#aaa' : accentColor },
                        ]}
                    >
                        {isSaving ? (
                            <ActivityIndicator color={primaryColor} />
                        ) : (
                            <Text style={styles.buttonText}>Save Settings</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: primaryColor,
    },
    container: {
        padding: 16,
    },
    buttonContainer: {
        marginTop: 32,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: primaryColor,
        fontWeight: '600',
        fontSize: 16,
    },
});
