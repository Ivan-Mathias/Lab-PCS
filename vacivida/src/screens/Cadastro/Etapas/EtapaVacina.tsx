import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ScrollView, View, Text } from 'react-native';
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
        validationSchema: Yup.object({
            imunobiologico: Yup.string().required(),
            data: Yup.string().required(),
            segundaDose: Yup.boolean(),
            lote: Yup.number().positive().required()
        }),
        onSubmit: (values) => handleSubmit(values)
    })

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {!formik.isValid && (
                    <Text style={styles.erro}>
                        Preencha os campos obrigatórios
                    </Text>
                )}
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Imunobiológico"
                        value={formik.values.imunobiologico}
                        erro={!!formik.errors.imunobiologico && !!formik.touched.imunobiologico}
                        onChange={formik.handleChange('imunobiologico')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Data da aplicação"
                        value={formik.values.data}
                        erro={!!formik.errors.data && !!formik.touched.data}
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
                        erro={!!formik.errors.lote && !!formik.touched.lote}
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
