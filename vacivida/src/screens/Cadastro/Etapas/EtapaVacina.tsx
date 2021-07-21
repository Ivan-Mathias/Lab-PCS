import { useFormik } from 'formik';
import React from 'react';
import { ScrollView, View } from 'react-native';
import ButtonProgress from '../../../components/ButtonProgress';
import OutlinedTextInput from '../../../components/OutlinedTextInput';
import SwitchInput from '../../../components/SwitchInput';
import { styles } from '../styles';

interface EtapaVacinaProps {
    initialValues?: DadosVacina;
    handleVoltar: () => void;
    handleSubmit: (dados: DadosVacina) => void;
}

export type DadosVacina = {
    imunobiologico: string;
    data: string;
    segundaDose: boolean;
    lote: number;
}

function Vacina ({ initialValues, handleVoltar, handleSubmit }: EtapaVacinaProps) {
    const formik = useFormik({
        initialValues: initialValues
        ? initialValues
        : {
            imunobiologico: '',
            data: '',
            segundaDose: false,
            lote: 0
        },
        onSubmit: (values) => handleSubmit(values)
    })

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Imunobiológico"
                        value={formik.values.imunobiologico}
                        onChange={formik.handleChange('imunobiologico')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Data da aplicação"
                        value={formik.values.data}
                        onChange={formik.handleChange('data')}
                        />
                </View>
                <View style={styles.linha}>
                    <SwitchInput
                        label="2ª dose"
                        value={formik.values.segundaDose}
                        toggleSwitch={() => formik.setFieldValue('segundaDose', !formik.values.segundaDose)}
                    />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Lote"
                        keyboardType="numeric"
                        value={formik.values.lote}
                        onChange={formik.handleChange('lote')}
                        />
                </View>
            </ScrollView>
            <ButtonProgress
                final
                error={false}
                onPressNext={formik.submitForm}
                onPressPrevious={handleVoltar}
            />
        </View>
    );
}

export default Vacina;
