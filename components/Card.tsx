import {Text, View} from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
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
                    backgroundColor: rightActionColor}}
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
        rightActionText,
        rightActionFn,
        rightActionColor,
    }: {
        title: string;
        secondaryText: string;
        marginVertical: number;
        onPress: () => void;
        rightActionText: string;
        rightActionFn: () => void;
        rightActionColor: ColorValue;
    }
) {
    const wrapperStyle= [styles.container, {marginVertical: marginVertical}];

    return (
        <ReanimatedSwipeable
            containerStyle={wrapperStyle}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={(prog, drag, sm) => {
                return SwipeAction(prog, drag, rightActionFn, rightActionText, rightActionColor);
            }}
        >
            <Pressable
                onPress={() => {
                    onPress();
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
            borderRadius: wrapperBorderRadius,
        }
    }
)