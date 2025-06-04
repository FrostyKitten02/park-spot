import {useEffect, useLayoutEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import StyledTextInput from '@/components/StyledTextInput';
import {useNavigation} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';

import {accentColor, primaryColor} from '@/constants/Colors';
import {CarStorage} from '@/storage/CarStorage';
import {Car, Location as Loc, LocationDb, Parked, ParkedDb} from '@/model/Models';
import StyledPicker from "@/components/StyledPicker";
import {LocationStorage} from "@/storage/LocationStorage";
import {ParkedStorage} from "@/storage/ParkedStorage";
import * as Location from 'expo-location';

export default function AddParkedModal() {
    const db = useSQLiteContext();
    const navigation = useNavigation();

    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCarId, setSelectedCarId] = useState<number | undefined>();
    const [locationString, setLocationString] = useState('');
    const [start, setStart] = useState('');
    const [finish, setFinish] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({title: 'Add Parked Entry'});
    }, []);

    useEffect(() => {
        CarStorage.getCarsAsync(db).then(setCars);
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Location permission is required.');
            return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const coords = `${loc.coords.latitude},${loc.coords.longitude}`;
        setLocationString(coords);
    };

    const handleSubmit = async () => {
        // if (!selectedCarId || !locationString) {
        //     Alert.alert('Missing Info', 'Car and location are required.');
        //     return;
        // }

        setIsLoading(true);

        try {
            const [lat, lon] = locationString.split(',');

            //TODO check saving location successfull then procceed to save parked
            const location: LocationDb = { latitude: lat, longitude: lon };
            const locationId = LocationStorage.saveLocation(db, location);

            const parked: ParkedDb = {
                carId: selectedCarId,
                // start,
                // finish,
                note: note,
                locationId: locationId,
            };

            console.log(parked);

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
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: primaryColor}}
                              behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <StyledPicker
                        label="Select Car"
                        selectedValue={selectedCarId}
                        onValueChange={(val) => setSelectedCarId(val)}
                        enabled={!isLoading}
                        options={[
                            { label: 'Choose a car...', value: undefined },
                            ...cars.map((car) => ({ label: car.name??"", value: car.id })),
                        ]}
                    />

                    <StyledTextInput
                        label="Start Time"
                        placeholder="e.g., 2024-06-03T14:00"
                        value={start}
                        onChangeText={setStart}
                        editable={!isLoading}
                    />

                    <StyledTextInput
                        label="Finish Time"
                        placeholder="e.g., 2024-06-03T16:00"
                        value={finish}
                        onChangeText={setFinish}
                        editable={!isLoading}
                    />

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
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: 'white',
    },
    pickerWrapper: {
        backgroundColor: '#fff',
        borderRadius: 6,
        marginBottom: 16,
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
