import {useState} from 'react';
import {Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View,} from 'react-native';
import StyledTextInput from '@/components/StyledTextInput';
import {accentColor, primaryColor, textSecondaryColor} from "@/constants/Colors";

export default function AddCarModal() {
    const [name, setName] = useState('');
    const [registrationPlate, setRegistrationPlate] = useState('');
    const [color, setColor] = useState('');

    const handleSubmit = () => {
        if (!name || !registrationPlate || !color) {
            Alert.alert('Missing Info', 'Please fill out all fields.');
            return;
        }

        console.log('Saving car:', { name, registrationPlate, color });
        Alert.alert('Success', 'Car added!');
        setName('');
        setRegistrationPlate('');
        setColor('');
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
                    <Button title="Add Car" color={accentColor} onPress={handleSubmit} />
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
    label: {
        color: textSecondaryColor,
        fontSize: 16,
        marginBottom: 4,
    },
    buttonContainer: {
        marginTop: 8,
        backgroundColor: accentColor,
        borderRadius: 8,
        overflow: 'hidden',
    },
});
