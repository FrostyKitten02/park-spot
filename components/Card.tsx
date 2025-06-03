import {Text, View} from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {accentColor2, primaryColor, textAccentColor, textSecondaryColor} from "@/constants/Colors";

const circleRadius = 50;
const borderRadius = circleRadius/2;

export default function Card(
    {
        title,
        secondaryText,
    }:{
        title: string;
        secondaryText: string;
    }
) {

    return (
        <View
            style={{
                backgroundColor: primaryColor,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                display: "flex",
                flexDirection: "row",
                columnGap: 16
            }}
        >
            <View
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: circleRadius,
                    height: circleRadius,
                    borderRadius: borderRadius,
                    backgroundColor: accentColor2,
                }}
            >
                <FontAwesome size={25} name="car" color={primaryColor} />
            </View>
            <View
                style={{
                    backgroundColor: primaryColor,
                }}
            >
                <Text
                    style={{
                        color: textAccentColor,
                        fontSize: 16
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        color: textSecondaryColor,
                        fontSize: 12
                    }}
                >
                    {secondaryText}
                </Text>
            </View>
        </View>
    )
}