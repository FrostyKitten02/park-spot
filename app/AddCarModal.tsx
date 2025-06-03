import {useEffect, useLayoutEffect, useState} from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import StyledTextInput from '@/components/StyledTextInput';
import { accentColor, primaryColor, textSecondaryColor } from "@/constants/Colors";
import { CarStorage } from "@/storage/CarStorage";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation, useLocalSearchParams } from "expo-router";
import {Car} from "@/model/Models";

export default function AddCarModal() {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const { carId } = useLocalSearchParams<{ carId?: string }>();

    const [name, setName] = useState('');
    const [registrationPlate, setRegistrationPlate] = useState('');
    const [color, setColor] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Car' : 'Add New Car',
        });
    }, [isEditing]);

    useEffect(() => {
        if (carId) {
            setIsEditing(true);
            CarStorage.getCarByIdAsync(db, parseInt(carId)).then((car) => {
                if (car) {
                    setName(car.name??"");
                    setRegistrationPlate(car.registrationPlateNumber??"");
                    setColor(car.color??"");
                } else {
                    Alert.alert('Error', 'Car not found.');
                    navigation.goBack();
                }
            });
        }
    }, [carId]);

    const handleSubmit = async () => {
        if (!name || !registrationPlate || !color) {
            Alert.alert('Missing Info', 'Please fill out all fields.');
            return;
        }

        const carData: Car = {
            name,
            registrationPlateNumber: registrationPlate,
            color,
        };

        if (isEditing) {
            carData.id = Number(carId);
        }

        try {
            CarStorage.saveCar(db, carData);
            if (isEditing && carId) {
                Alert.alert('Success', 'Car updated!');
            } else {
                Alert.alert('Success', 'Car added!');
            }
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save car.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: primaryColor }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <StyledTextInput
                    label="Car name"
                    placeholder="Enter car name"
                    value={name}
                    onChangeText={setName}
                />

                <StyledTextInput
                    label="Registration Plate"
                    placeholder="Enter plate number"
                    value={registrationPlate}
                    onChangeText={setRegistrationPlate}
                />

                <StyledTextInput
                    label="Color"
                    placeholder="Enter car color"
                    value={color}
                    onChangeText={setColor}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title={isEditing ? "Update Car" : "Add Car"}
                        color={accentColor}
                        onPress={handleSubmit}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: primaryColor,
        flexGrow: 1,
    },
    buttonContainer: {
        marginTop: 8,
        backgroundColor: accentColor,
        borderRadius: 8,
        overflow: 'hidden',
    },
});
