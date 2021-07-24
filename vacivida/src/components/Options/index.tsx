import "react-native-gesture-handler"
import React, { useState } from "react";
import { Text, View, Modal } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

type OptionsProps = {
    screenHome: string;
    screenCadastro: string;
}

export default function Options ({screenHome, screenCadastro}: OptionsProps) {
    const [optionsVisible, setOptionsVisible] = useState(false);
    const navigation = useNavigation();
    return(
        <View>
            <Modal 
                animationType="fade"
                transparent={true}
                visible={optionsVisible}
                onRequestClose={() => {setOptionsVisible(!optionsVisible);}}
            >
                <View style={styles.optionsBox}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={styles.optionsContent}>Meu Perfil</Text>
                        <Button style={{position: 'absolute', width: 180, alignSelf: 'center'}} 
                            children=""
                            onPress={() => {navigation.navigate(screenHome), setOptionsVisible(false);}}
                            color="#fff"
                            />
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={styles.optionsContent}>Novo cadastro</Text>
                        <Button style={{position: 'absolute', width: 180, alignSelf: 'center'}}
                            children=""
                            onPress={() => {navigation.navigate(screenCadastro), setOptionsVisible(false)}}
                            color="#fff"
                            />
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={styles.optionsContent}>Fechar</Text>
                        <Button style={{position: 'absolute', width: 180, alignSelf: 'center'}} 
                            children=""
                            onPress={() => setOptionsVisible(false)}
                            color="#fff"
                            />
                    </View>
                </View>
            </Modal>
            <Button style={styles.threeDotsIcon}
                children=""
                icon={require('../../assets/three-dots.png')}
                onPress={() => {setOptionsVisible(!optionsVisible);}}
                color="#909090"
            />
        </View>
    );
}
