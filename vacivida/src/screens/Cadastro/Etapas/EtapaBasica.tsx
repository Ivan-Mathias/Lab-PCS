import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { View, Text } from 'react-native';
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
    viewOnly?: boolean;
    handleSubmit: (dados: DadosBase) => void;
}

export type DadosBase = {
    nome: string | null;
    cpf: number | null;
    cns: number | null;
    telefone: number | null;
    nascimento: string | null;
    sexo: string | null;
    raca: string | null;
    gestante: boolean;
    puerpera: boolean;
}

function Basica ({ initialValues, viewOnly = false, handleSubmit }: Etaparops) {
    const formik = useFormik({
        initialValues: initialValues
            ? initialValues
            : {
            nome: '',
            cpf: 0,
            cns: 0,
            telefone: null,
            nascimento: null,
            sexo: null,
            raca: null,
            gestante: false,
            puerpera: false
        },
        validationSchema: Yup.object({
            nome: Yup.string().required(),
            cpf: Yup.number().positive().required(),
            cns: Yup.number().positive().required(),
            telefone: Yup.string().required(),
            nascimento: Yup.string().required(),
            sexo: Yup.string().test(
                'string-vazia',
                'Selecione uma opção',
                sexo => !sexo || sexo.length !== 0
            ),
            raca: Yup.string().test(
                'string-vazia',
                'Selecione uma opção',
                raca => !raca || raca.length !== 0
            )
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
                        label="Nome do paciente"
                        viewOnly={viewOnly}
                        value={formik.values.nome}
                        erro={!!formik.errors.nome && !!formik.touched.nome}
                        onChange={formik.handleChange('nome')}
                    />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="CPF"
                        keyboardType="numeric"
                        viewOnly={viewOnly}
                        value={formik.values.cpf}
                        erro={!!formik.errors.cpf && !!formik.touched.cpf}
                        onChange={formik.handleChange('cpf')}
                    />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="CNS"
                        keyboardType="numeric"
                        value={formik.values.cns}
                        viewOnly={viewOnly}
                        erro={!!formik.errors.cns && !!formik.touched.cns}
                        onChange={formik.handleChange('cns')}
                    />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Telefone"
                        viewOnly={viewOnly}
                        value={formik.values.telefone}
                        erro={!!formik.errors.telefone && !!formik.touched.telefone}
                        keyboardType="numeric"
                        onChange={formik.handleChange('telefone')}
                    />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Nascimento"
                        viewOnly={viewOnly}
                        value={formik.values.nascimento}
                        erro={!!formik.errors.nascimento && !!formik.touched.nascimento}
                        onChange={formik.handleChange('nascimento')}
                    />
                </View>
                <View style={styles.linha}>
                    <SelectInput
                        label="Sexo"
                        viewOnly={viewOnly}
                        value={formik.values.sexo || ''}
                        erro={!!formik.errors.sexo && !!formik.touched.sexo}
                        handleChange={formik.handleChange('sexo')}
                        options={SexoValues}
                        getValue={(option) => option}
                    />
                    <View style={styles.espacador}/>
                    <SelectInput
                        label="Raça"
                        viewOnly={viewOnly}
                        value={formik.values.raca || ''}
                        erro={!!formik.errors.raca && !!formik.touched.raca}
                        handleChange={formik.handleChange('raca')}
                        options={RacaValues}
                        getValue={(option) => option}
                    />
                </View>
                <View style={styles.linha}>
                    <SwitchInput
                        label="Gestante"
                        viewOnly={viewOnly}
                        value={formik.values.gestante}
                        toggleSwitch={() => formik.setFieldValue('gestante', !formik.values.gestante)}
                    />
                    <View style={styles.espacador}/>
                    <SwitchInput
                        label="Puérpera"
                        viewOnly={viewOnly}
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
