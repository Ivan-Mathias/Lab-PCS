import { useFormik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ButtonProgress from '../../../components/ButtonProgress';
import OutlinedTextInput from '../../../components/OutlinedTextInput';
import SelectInput from '../../../components/SelectiInput';
import SwitchInput from '../../../components/SwitchInput';
import { RacaValues } from '../../../types/raca';
import { SexoValues } from '../../../types/sexo';
import { styles } from '../styles';

interface Etaparops {
    initialValues?: DadosBase;
    handleSubmit: (dados: DadosBase) => void;
}

export type DadosBase = {
    nome: string | null;
    cpf: string | null;
    cns: string | null;
    telefone: number | null;
    nascimento: string | null;
    sexo: string | null;
    raca: string | null;
    gestante: boolean;
    puerpera: boolean;
}

function Basica ({ initialValues, handleSubmit }: Etaparops) {
    const formik = useFormik({
        initialValues: initialValues
            ? initialValues
            : {
            nome: '',
            cpf: '',
            cns: '',
            telefone: null,
            nascimento: null,
            sexo: null,
            raca: null,
            gestante: false,
            puerpera: false
        },
        onSubmit: (values) => handleSubmit(values)
    })

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Nome do paciente"
                        value={formik.values.nome}
                        onChange={formik.handleChange('nome')}
                    />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="CPF"
                        keyboardType="numeric"
                        value={formik.values.cpf}
                        onChange={formik.handleChange('cpf')}
                    />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="CNS"
                        keyboardType="numeric"
                        value={formik.values.cns}
                        onChange={formik.handleChange('cns')}
                    />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Telefone"
                        value={formik.values.telefone}
                        keyboardType="numeric"
                        onChange={formik.handleChange('telefone')}
                    />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Nascimento"
                        value={formik.values.nascimento}
                        onChange={formik.handleChange('nascimento')}
                    />
                </View>
                <View style={styles.linha}>
                    <SelectInput
                        label="Sexo"
                        value={formik.values.sexo || ''}
                        handleChange={formik.handleChange('sexo')}
                        options={SexoValues}
                        getValue={(option) => option}
                    />
                    <View style={styles.espacador}/>
                    <SelectInput
                        label="Raça"
                        value={formik.values.raca || ''}
                        handleChange={formik.handleChange('raca')}
                        options={RacaValues}
                        getValue={(option) => option}
                    />
                </View>
                <View style={styles.linha}>
                    <SwitchInput
                        label="Gestante"
                        value={formik.values.gestante}
                        toggleSwitch={() => formik.setFieldValue('gestante', !formik.values.gestante)}
                    />
                    <View style={styles.espacador}/>
                    <SwitchInput
                        label="Puérpera"
                        value={formik.values.puerpera}
                        toggleSwitch={() => formik.setFieldValue('puerpera', !formik.values.puerpera)}
                    />
                </View>
            </ScrollView>
            <ButtonProgress
                first
                error={false}
                onPressNext={formik.submitForm}
            />
        </View>
    );
}

export default Basica;
