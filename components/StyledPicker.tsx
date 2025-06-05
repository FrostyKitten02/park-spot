import {View, Text, StyleSheet, Platform} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { accentColor, primaryColor, textSecondaryColor } from '@/constants/Colors';

interface StyledPickerProps<T> {
    label?: string;
    selectedValue: T | undefined;
    onValueChange: (itemValue: T, itemIndex: number) => void;
    enabled?: boolean;
    options: { label: string; value: T }[];
}

export default function StyledPicker<T>(props: StyledPickerProps<T>) {
    const { label, selectedValue, onValueChange, enabled = true, options } = props;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.pickerWrapper, Platform.OS === 'ios' && styles.pickerWrapperIOS]}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    enabled={enabled}
                    dropdownIconColor={textSecondaryColor}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    {options.map(({ label, value }, index) => (
                        <Picker.Item key={index} label={label} value={value} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: textSecondaryColor,
        fontSize: 12,
        marginBottom: 4,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: textSecondaryColor,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: primaryColor,
        justifyContent: 'center',
        height: 48,
    },
    pickerWrapperIOS: {
        borderWidth: 0,
    },
    picker: {
        color: textSecondaryColor,
        width: '100%',
        margin: 0,
        padding: 0,
    },
    pickerItem: {
        fontSize: 16,
        padding: 0,
        margin: 0
    },
});
