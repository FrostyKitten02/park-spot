import {useEffect, useLayoutEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    InteractionManager,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import StyledTextInput from '@/components/StyledTextInput';
import {useLocalSearchParams, useNavigation} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';

import {accentColor, primaryColor} from '@/constants/Colors';
import {Car, LocationDb, ParkedDb} from '@/model/Models';
import StyledPicker from "@/components/StyledPicker";
import {LocationStorage} from "@/storage/LocationStorage";
import {ParkedStorage} from "@/storage/ParkedStorage";
import * as Location from 'expo-location';
import DateTimePicker, {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useIsFocused} from "@react-navigation/core";
import {CarStorage} from "@/storage/CarStorage";

export default function AddParkedModal() {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { parkedId } = useLocalSearchParams<{ parkedId?: string }>();

    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCarId, setSelectedCarId] = useState<number | undefined>();
    const [locationId, setLocationId] = useState<number | undefined>();
    const [locationString, setLocationString] = useState('');
    const [start, setStart] = useState<Date | undefined>(new Date());
    const [finish, setFinish] = useState<Date | undefined>();
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showFinishPicker, setShowFinishPicker] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'Add Parked Entry' });
    }, []);

    useEffect(() => {
        CarStorage.getCarsAsync(db)
            .then(res => setCars(res))
    }, [db, parkedId]);

    useEffect(() => {
        if (isFocused) {
            const task = InteractionManager.runAfterInteractions(() => {
                fetchLocation();
            });

            return () => task.cancel();
        }
    }, [isFocused, parkedId]);

    useEffect(() => {
        const loadParked = async () => {
            if (parkedId) {
                const parked = await ParkedStorage.getParkedByIdAsync(db, Number(parkedId));
                if (parked) {
                    setSelectedCarId(parked.carId);
                    setStart(parked.start ? new Date(parked.start) : undefined);
                    setFinish(parked.finish ? new Date(parked.finish) : undefined);
                    setNote(parked.note ?? '');

                    if (parked.locationId) {
                        const location = LocationStorage.getLocationById(db, parked.locationId);
                        if (location?.latitude && location?.longitude) {
                            setLocationString(`${location.latitude},${location.longitude}`);
                        }
                    }
                }
            }
        };

        loadParked();
    }, [db, parkedId]);



    const fetchLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Location permission is required.');
            return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const coords = `${loc.coords.latitude},${loc.coords.longitude}`;
        setLocationString(coords);
    };

    const formatDateTime = (date?: Date) => {
        if (!date) {
            return '';
        }

        return date.toLocaleString();
    };

    const showDateTimePickerAndroid = (
        initialDate: Date,
        onConfirm: (date: Date) => void
    ) => {
        DateTimePickerAndroid.open({
            value: initialDate,
            mode: 'date',
            onChange: (eventDate, selectedDate) => {
                if (eventDate.type == 'set' && selectedDate) {
                    DateTimePickerAndroid.open({
                        value: selectedDate,
                        mode: 'time',
                        is24Hour: true,
                        onChange: (eventTime, selectedTime) => {
                            if (eventTime.type === 'set' && selectedTime) {
                                const combined = new Date(
                                    selectedDate.getFullYear(),
                                    selectedDate.getMonth(),
                                    selectedDate.getDate(),
                                    selectedTime.getHours(),
                                    selectedTime.getMinutes()
                                );
                                onConfirm(combined);
                            }
                        }
                    });
                }
            }
        });
    };

    const handleStartPress = () => {
        const current = !!start ? new Date(start) : new Date();
        if (Platform.OS === 'android') {
            showDateTimePickerAndroid(current, (date) => {
                setStart(date);
            });
        } else {
            setShowStartPicker(true);
        }
    };

    const handleFinishPress = () => {
        const current = !!finish ? new Date(finish) : new Date();
        if (Platform.OS === 'android') {
            showDateTimePickerAndroid(current, (date) => {
                setFinish(date);
            });
        } else {
            setShowFinishPicker(true);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const [lat, lon] = locationString.split(',');
            const location: LocationDb = { latitude: lat, longitude: lon };

            if (!!locationId) {
                location.id = locationId
            }

            const savedLocationId = await LocationStorage.saveLocation(db, location);
            const parked: ParkedDb = {
                carId: selectedCarId,
                start: start,
                finish: finish,
                note: note,
                locationId: savedLocationId,
            };

            if (!!parkedId) {
                parked.id = Number(parkedId);
            }

            await ParkedStorage.saveParkedAsync(db, parked);

            Alert.alert('Success', 'Parked entry added!');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save entry.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: primaryColor }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <StyledPicker
                        label="Select Car"
                        selectedValue={selectedCarId}
                        onValueChange={setSelectedCarId}
                        enabled={!isLoading}
                        options={[
                            { label: 'Choose a car...', value: undefined },
                            ...cars.map((car) => ({ label: car.name ?? "", value: car.id })),
                        ]}
                    />

                    <Pressable onPress={handleStartPress}>
                        <StyledTextInput
                            label="Start Time"
                            value={formatDateTime(start)}
                            editable={false}
                        />
                    </Pressable>

                    <Pressable onPress={handleFinishPress}>
                        <StyledTextInput
                            label="Finish Time"
                            value={formatDateTime(finish)}
                            editable={false}
                        />
                    </Pressable>

                    <StyledTextInput
                        label="Note"
                        placeholder="Additional notes"
                        value={note}
                        onChangeText={setNote}
                        editable={!isLoading}
                    />

                    <StyledTextInput
                        label="Location"
                        value={locationString}
                        editable={false}
                    />

                    {Platform.OS === 'ios' && showStartPicker && (
                        <DateTimePicker
                            value={start ? new Date(start) : new Date()}
                            mode="datetime"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowStartPicker(false);
                                if (selectedDate) {
                                    setStart(selectedDate);
                                }
                            }}
                        />
                    )}

                    {Platform.OS === 'ios' && showFinishPicker && (
                        <DateTimePicker
                            value={finish ? new Date(finish) : new Date()}
                            mode="datetime"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowFinishPicker(false);
                                if (selectedDate) {
                                    setFinish(selectedDate);
                                }
                            }}
                        />
                    )}
                </ScrollView>

                <View style={styles.buttonContainer}>
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
                            <Text style={styles.buttonText}>Add Parked Entry</Text>
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
