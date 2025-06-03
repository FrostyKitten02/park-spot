import {TextInput, TextInputProps, View} from "react-native";
import {accentColor, accentColor2, primaryColor, textSecondaryColor} from "@/constants/Colors";
import { StyleSheet } from 'react-native';

export default function StyledTextInput(props: TextInputProps) {
    return (
        <View style={styles.container}>
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
        padding: 8,
        backgroundColor: primaryColor,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        backgroundColor: accentColor2,
        color: primaryColor,
        borderColor: accentColor,
        borderWidth: 2,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
});