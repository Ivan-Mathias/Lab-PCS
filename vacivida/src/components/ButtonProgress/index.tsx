import React from 'react';
import { View } from 'react-native';
import ButtonStep from '../ButtonStep';
import styles from './styles';

interface ButtonProgressProps {
    error: boolean;
    first?: boolean;
    final?: boolean;
    onPressNext: () => void;
    onPressPrevious?: () => void;
}

function ButtonProgress ({ first, final = false, onPressNext, onPressPrevious }: ButtonProgressProps) {
    return (
        <View style={styles.container}>
            {first || !onPressPrevious
                ? <View style={{ flex: 1 }}/>
                : (
                    <ButtonStep
                        type="secondary"
                        onPress={onPressPrevious}
                    />
                )
            }
            <View style={styles.espacador}/>
            <ButtonStep
                type={final ? 'final' : 'primary'}
                onPress={onPressNext}
            />
        </View>
    );
}

export default ButtonProgress;
