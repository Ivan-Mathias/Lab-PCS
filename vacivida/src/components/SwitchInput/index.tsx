import React from 'react';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Switch } from 'react-native-paper';
import styles from './styles';

interface SwitchInputProps {
    label: string;
    value?: boolean;
    toggleSwitch: (value: boolean) => void;
}

function SwitchInput ({ label, value, toggleSwitch }: SwitchInputProps) {
    return (
        <RectButton style={styles.container}
            onPress={toggleSwitch}
        >
            <Text>{label}</Text>
            <Switch
                value={value}
                onValueChange={(value) => toggleSwitch(value)}
            />
        </RectButton>
    );
}

export default SwitchInput;
