import React from 'react';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import styles from './styles';

interface OutlinedTextInputProps {
    label: string;
    value: string | number | null;
    onChange: (e: string) => void;
    keyboardType?: KeyboardTypeOptions
}

function OutlinedTextInput ({ label, value, onChange, keyboardType }: OutlinedTextInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.legenda}>
                {label}
            </Text>
            <TextInput
                style={styles.input}
                keyboardType={keyboardType}
                value={(value || '').toString()}
                onChangeText={text => onChange(text)}
            />
        </View>
    );
}

export default OutlinedTextInput;
