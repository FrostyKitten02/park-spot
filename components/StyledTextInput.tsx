import {Text, TextInput, TextInputProps, View} from "react-native";
import {accentColor, accentColor2, primaryColor, textSecondaryColor} from "@/constants/Colors";
import { StyleSheet } from 'react-native';

interface StyledTextInputProps extends TextInputProps {
    label?: string;
}

export default function StyledTextInput({ label, ...props }: StyledTextInputProps) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                placeholder="Enter text..."
                placeholderTextColor={textSecondaryColor}
                style={styles.input}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: textSecondaryColor,
        fontSize: 14,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: textSecondaryColor,
        borderRadius: 8,
        padding: 10,
        color: textSecondaryColor,
        backgroundColor: primaryColor,
    },
});