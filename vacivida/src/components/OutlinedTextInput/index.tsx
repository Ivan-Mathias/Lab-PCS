import React from 'react';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import theme from '../../global/theme';
import styles from './styles';

interface OutlinedTextInputProps {
    label: string;
    value: string | number | null;
    viewOnly?: boolean;
    erro?: boolean;
    onChange: (e: string) => void;
    keyboardType?: KeyboardTypeOptions
}

function OutlinedTextInput ({
    label,
    value,
    viewOnly = false,
    erro = false,
    onChange, keyboardType
}: OutlinedTextInputProps) {
    return (
        <View style={styles.container}>
            <Text style={[styles.legenda, erro ? { color: theme.colors.error } : {}]}>
                {label}
            </Text>
            {viewOnly ? (
                <Text style={[
                    styles.input,
                    { lineHeight: 56 }
                ]}>
                    {value}
                </Text>
            ) : (
                <TextInput
                    style={[
                        styles.input,
                        erro ? { borderColor: theme.colors.error } : {}
                    ]}
                    keyboardType={keyboardType}
                    value={(value || '').toString()}
                    onChangeText={text => onChange(text)}
                />
            )}
        </View>
    );
}

export default OutlinedTextInput;
