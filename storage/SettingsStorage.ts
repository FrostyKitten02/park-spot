import AsyncStorage from "@react-native-async-storage/async-storage";

export class SettingsStorage {
    private constructor() {}

    private static defaultCarIdKey = "settings_default_car_id"

    public static async getSettings(): Promise<Settings> {
        const defaultCarId = await AsyncStorage.getItem(SettingsStorage.defaultCarIdKey)

        if (defaultCarId == null) {
            return {};
        }

        return {
            defaultCarId: Number(defaultCarId),
        }
    }

    public static async setDefaultCarId(carId: number | undefined) {
        if (carId === undefined) {
            return await AsyncStorage.removeItem(SettingsStorage.defaultCarIdKey);
        }

        return await AsyncStorage.setItem(SettingsStorage.defaultCarIdKey, String(carId))
    }

}

export interface Settings {
    defaultCarId?: number;
}