import { useEffect, useLayoutEffect, useState } from 'react';
import { PixelRatio } from 'react-native';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import StyledTextInput from '@/components/StyledTextInput';
import { accentColor, primaryColor } from '@/constants/Colors';
import { CarStorage } from '@/storage/CarStorage';
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Car } from '@/model/Models';

export default function AddCarModal() {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const { carId } = useLocalSearchParams<{ carId?: string }>();

    const [name, setName] = useState('');
    const [registrationPlate, setRegistrationPlate] = useState('');
    const [color, setColor] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const isIOS = Platform.OS === 'ios';

    useEffect(() => {
        if (carId) {
            navigation.setOptions({
                title: !!carId ? 'Edit Car' : 'Add New Car',
            });
            setIsEditing(true);
            CarStorage.getCarByIdAsync(db, parseInt(carId)).then((car) => {
                if (car) {
                    setName(car.name ?? '');
                    setRegistrationPlate(car.registrationPlateNumber ?? '');
                    setColor(car.color ?? '');
                } else {
                    Alert.alert('Error', 'Car not found.');
                    navigation.goBack();
                }
            });
        }
    }, [carId, db]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
            const actualHeight = e.endCoordinates.height / PixelRatio.get()
            setKeyboardHeight(actualHeight + 16);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleSubmit = async () => {
        if (!name || !registrationPlate || !color) {
            Alert.alert('Missing Info', 'Please fill out all fields.');
            return;
        }

        setIsLoading(true);

        const carData: Car = {
            name,
            registrationPlateNumber: registrationPlate,
            color,
        };

        if (isEditing) {
            carData.id = Number(carId);
        }

        try {
            await CarStorage.saveCarSync(db, carData);
            Alert.alert('Success', isEditing ? 'Car updated!' : 'Car added!');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save car.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: primaryColor }}
            behavior={isIOS ? 'padding' : undefined}
        >
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <StyledTextInput
                        label="Car name"
                        placeholder="Enter car name"
                        value={name}
                        onChangeText={setName}
                        editable={!isLoading}
                    />

                    <StyledTextInput
                        label="Registration Plate"
                        placeholder="Enter plate number"
                        value={registrationPlate}
                        onChangeText={setRegistrationPlate}
                        editable={!isLoading}
                    />

                    <StyledTextInput
                        label="Color"
                        placeholder="Enter car color"
                        value={color}
                        onChangeText={setColor}
                        editable={!isLoading}
                    />
                </ScrollView>

                <View style={[styles.buttonContainer, { marginBottom: keyboardHeight}]}>
                    <Pressable
                        onPress={handleSubmit}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? '#c0c0c0' : accentColor,
                                opacity: isLoading ? 0.6 : 1,
                            },
                            styles.buttonPressable,
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={primaryColor} />
                        ) : (
                            <Text style={styles.buttonText}>
                                {isEditing ? 'Update Car' : 'Add Car'}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 16,
        backgroundColor: primaryColor,
        flexGrow: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: primaryColor,
    },
    buttonPressable: {
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: primaryColor,
        fontWeight: '600',
        fontSize: 16,
    },
});
