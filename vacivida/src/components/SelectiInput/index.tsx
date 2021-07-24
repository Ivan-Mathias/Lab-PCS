import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text } from 'react-native';
import styles from './styles';
import theme from '../../global/theme';

interface SelectInputProps<T> {
    label: string;
    value: T;
    erro?: boolean;
    handleChange: (e: T) => void;
    options: T[];
    getValue: (option: T) => string;
}

function SelectInput<T> ({
    label,
    value,
    erro = false,
    handleChange,
    options,
    getValue
}: SelectInputProps<T>) {
    return (
        <View style={styles.container}>
            <Text style={[
                styles.legenda,
                erro ? { color: theme.colors.error } : {}
            ]}>{label}</Text>
            <View style={[
                styles.wrapper,
                erro ? { borderColor: theme.colors.error } : {}
            ]}>
                <Picker
                    selectedValue={value} style={styles.picker}
                    onValueChange={(itemValue) => handleChange(itemValue)}

                >
                    <Picker.Item style={erro ? { color: theme.colors.error } : {}} label="Selecione" value=""/>
                    {options.map(option => {
                        return <Picker.Item key={getValue(option)} label={getValue(option)} value={getValue(option)}/>
                    })}
                </Picker>
            </View>
        </View>
    );
}

export default SelectInput;
