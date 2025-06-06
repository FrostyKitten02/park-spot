import React, {createContext, useContext, useEffect, useState} from 'react';
import {Settings, SettingsStorage} from "@/storage/SettingsStorage";


interface SettingsCtx extends Settings {
    setDefaultCarId: (id: number | undefined) => Promise<void>
}

const SettingsContext = createContext<SettingsCtx>({
    defaultCarId: undefined,
    setDefaultCarId: (id) => Promise.resolve(undefined),
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>();

    useEffect(() => {
        (async () => {
            const st = await SettingsStorage.getSettings()
            setSettings(st)
        })();
    }, []);

    const setDefaultCarId = async (id: number | undefined) => {
        await SettingsStorage.setDefaultCarId(id);
        const st = await SettingsStorage.getSettings();
        setSettings(st);
    };

    return (
        <SettingsContext.Provider value={{...settings, setDefaultCarId: setDefaultCarId }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);