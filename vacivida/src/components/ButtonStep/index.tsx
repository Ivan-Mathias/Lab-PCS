import React from 'react';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styles from './styles';

interface ButtonStePropsProps {
    type: 'primary' | 'secondary';
    disabled?: boolean;
    onPress: () => void;
}

function ButtonStepProps ({ type, onPress }: ButtonStePropsProps) {
    return (
        <RectButton
            style={[
                styles.container,
                type === 'primary' && styles.primary,
                type === 'secondary' && styles.secondary ]}
            activeOpacity={0.7}
            onPress={onPress}
        >

            <Text style={[styles.texto,
                type === 'primary' && {
                    color: 'white'
                }
            ]}>
                {type === 'primary' && 'Próximo'}
                {type === 'secondary' && 'Anterior'}
            </Text>
        </RectButton>
    );
}

export default ButtonStepProps;
