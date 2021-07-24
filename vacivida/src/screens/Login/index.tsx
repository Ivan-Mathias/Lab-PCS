import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

export default function Login () {
    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Esse é a página de Login
            </Text>
            <Text style={styles.texto}>
                Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Ab, incidunt, aperiam
                iste quas non perferendis cum vitae officia,
                laudantium nemo praesentium. Ducimus facilis
                est, error eum perferendis voluptates veritatis maxime.
            </Text>
        </View>
    );
}
