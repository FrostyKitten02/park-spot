import {Text, View} from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, {useRef} from "react";
import {accentColor2, primaryColor, textAccentColor, textSecondaryColor} from "@/constants/Colors";
import {ColorValue, Pressable, StyleSheet} from "react-native";
import Reanimated, {SharedValue, useAnimatedStyle,} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';


const circleRadius = 50;
const borderRadius = circleRadius / 2;
const rightActionWidth = 70;

const wrapperBorderRadius = 8;
const paddingVertical = 8;

function SwipeAction(prog: SharedValue<number>, drag: SharedValue<number>, action: () => void, rightActionText: string, rightActionColor: ColorValue) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{translateX: drag.value + rightActionWidth}],
        };
    });

    return (
        <Reanimated.View style={styleAnimation}>
            <Text
                style={{
                    minHeight: "100%",
                    width: rightActionWidth,
                    borderBottomLeftRadius: wrapperBorderRadius,
                    borderTopLeftRadius: wrapperBorderRadius,
                    textAlign: "center",
                    textAlignVertical: "center",
                    backgroundColor: rightActionColor
                }}
                onPress={action}
            >
                {rightActionText}
            </Text>
        </Reanimated.View>
    );
}

export default function Card(
    {
        title,
        secondaryText,
        marginVertical,
        onPress,
        onDoublePress,
        rightActionText,
        rightActionFn,
        rightActionColor,
        iconColor,
    }: {
        title: string;
        secondaryText: string;
        marginVertical: number;
        onPress: () => void;
        onDoublePress: () => void;
        rightActionText: string;
        rightActionFn?: () => void;
        rightActionColor: ColorValue;
        iconColor?: string;
    }
) {
    const lastPress = useRef<number | null>(null);

    function handlePress() {
        const now = Date.now();
        if (lastPress.current && now - lastPress.current < 300) {
            onDoublePress();
            lastPress.current = null;
        } else {
            lastPress.current = now;
            setTimeout(() => {
                if (lastPress.current && Date.now() - lastPress.current >= 300) {
                    onPress();
                    lastPress.current = null;
                }
            }, 300);
        }
    }


    const wrapperStyle = [styles.container, {marginVertical: marginVertical}];

    return (
        <ReanimatedSwipeable
            containerStyle={wrapperStyle}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={!!rightActionFn ? (prog, drag, sm) => {
                return SwipeAction(prog, drag, rightActionFn, rightActionText, rightActionColor);
            } : undefined}
        >
            <Pressable
                onPress={() => {
                    handlePress();
                }}
            >
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 16,
                    backgroundColor: primaryColor,
                }}>
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
                        <FontAwesome size={25} name="car" color={primaryColor}/>
                    </View>
                    <View
                        style={{
                            backgroundColor: primaryColor,
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                backgroundColor: primaryColor,
                            }}
                        >
                            <Text
                                style={{
                                    color: textAccentColor,
                                    fontSize: 16,
                                }}
                            >
                                {title}
                            </Text>
                            {iconColor ? (
                                <View
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: iconColor,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 2,
                                        elevation: 3,
                                    }}
                                />
                            ) : null}
                        </View>

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
            </Pressable>
        </ReanimatedSwipeable>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            backgroundColor: primaryColor,
            paddingVertical: paddingVertical,
            paddingHorizontal: 16,
            width: "100%",
            borderRadius: wrapperBorderRadius,
        }
    }
)