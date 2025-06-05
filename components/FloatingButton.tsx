import { StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {Href, Link} from "expo-router";
import { accentColor, primaryColor } from "@/constants/Colors";

export interface FloatingButtonProps {
    link: Href;
}

export default function FloatingButton({ link }: FloatingButtonProps) {
    return (
        <Link href={link} asChild>
            <Pressable style={styles.fab}>
                <FontAwesome name="plus" size={24} color={primaryColor} />
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: accentColor,
        borderRadius: 32,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
