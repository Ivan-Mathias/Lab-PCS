import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text } from 'react-native';
import styles from './styles';

interface SelectInputProps<T> {
    label: string;
    value: T;
    handleChange: (e: T) => void;
    options: T[];
    getValue: (option: T) => string;
}

function SelectInput<T> ({ label, value, handleChange, options, getValue }: SelectInputProps<T>) {
    return (
        <View style={styles.container}>
            <Text style={styles.legenda}>{label}</Text>
            <Picker
                selectedValue={value} style={styles.picker}
                onValueChange={(itemValue) => handleChange(itemValue)}

            >
                <Picker.Item label="Selecione" value=""/>
                {options.map(option => {
                    return <Picker.Item key={getValue(option)} label={getValue(option)} value={getValue(option)}/>
                })}
            </Picker>
        </View>
    );
}

export default SelectInput;
