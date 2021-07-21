import React from "react";
import { Text, TextInput as TxtInput, TextInputProps as TxtInputProps, View } from "react-native";
import styles from "./styles";

interface TextInputProps extends TxtInputProps {
    legenda: string;
}

export default function TextInput({ legenda, ...rest }: TextInputProps) {
    return(
        <View style={styles.container}>
            <Text style={styles.legenda}>
                {legenda}
            </Text>
            <TxtInput
                style={styles.input}
                {...rest}
            />
        </View>
    );
}
