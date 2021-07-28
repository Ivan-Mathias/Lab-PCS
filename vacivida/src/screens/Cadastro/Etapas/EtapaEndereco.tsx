import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ScrollView, View, Text } from 'react-native';
import ButtonProgress from '../../../components/ButtonProgress';
import OutlinedTextInput from '../../../components/OutlinedTextInput';
import { styles } from '../styles';

interface EtapaEnderecoProps {
    initialValues?: DadosEndereco;
    viewOnly?: boolean;
    handleVoltar: () => void;
    handleSubmit: (dados: DadosEndereco) => void;
}

export type DadosEndereco = {
    nomeSocial: string;
    nomeDaMae: string;
    pais: string;
    uf: string;
    municipio: string;
    zona: string;
    logradouro: string;
    numero: number;
    bairro: string;
    complemento?: string;
    email: string;
}

function Endereco ({ initialValues, viewOnly = false, handleVoltar, handleSubmit }: EtapaEnderecoProps) {
    const formik = useFormik({
        initialValues: initialValues
        ? initialValues
        : {
            nomeSocial: '',
            nomeDaMae: '',
            pais: '',
            uf: '',
            municipio: '',
            zona: '',
            logradouro: '',
            numero: 0,
            bairro: '',
            complemento: '',
            email: ''
        },
        validationSchema: Yup.object({
            nomeSocial: Yup.string(),
            nomeDaMae: Yup.string().required(),
            pais: Yup.string().required(),
            uf: Yup.string().required(),
            municipio: Yup.string().required(),
            zona: Yup.string().required(),
            logradouro: Yup.string().required(),
            numero: Yup.number().positive().required(),
            bairro: Yup.string().required(),
            complemento: Yup.string(),
            email: Yup.string().required()
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
                        label="Nome social"
                        viewOnly={viewOnly}
                        value={formik.values.nomeSocial}
                        erro={!!formik.errors.nomeSocial && !!formik.touched.nomeSocial}
                        onChange={formik.handleChange('nomeSocial')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Nome da mãe"
                        viewOnly={viewOnly}
                        value={formik.values.nomeDaMae}
                        erro={!!formik.errors.nomeDaMae && !!formik.touched.nomeDaMae}
                        onChange={formik.handleChange('nomeDaMae')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="País"
                        viewOnly={viewOnly}
                        value={formik.values.pais}
                        erro={!!formik.errors.pais && !!formik.touched.pais}
                        onChange={formik.handleChange('pais')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="UF"
                        viewOnly={viewOnly}
                        value={formik.values.uf}
                        erro={!!formik.errors.uf && !!formik.touched.uf}
                        onChange={formik.handleChange('uf')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Município"
                        viewOnly={viewOnly}
                        value={formik.values.municipio}
                        erro={!!formik.errors.municipio && !!formik.touched.municipio}
                        onChange={formik.handleChange('municipio')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Zona"
                        viewOnly={viewOnly}
                        value={formik.values.zona}
                        erro={!!formik.errors.zona && !!formik.touched.zona}
                        onChange={formik.handleChange('zona')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Logradouro"
                        viewOnly={viewOnly}
                        value={formik.values.logradouro}
                        erro={!!formik.errors.logradouro && !!formik.touched.logradouro}
                        onChange={formik.handleChange('logradouro')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Número"
                        viewOnly={viewOnly}
                        keyboardType="numeric"
                        value={formik.values.numero}
                        erro={!!formik.errors.numero && !!formik.touched.numero}
                        onChange={formik.handleChange('numero')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Bairro"
                        viewOnly={viewOnly}
                        value={formik.values.bairro}
                        erro={!!formik.errors.bairro && !!formik.touched.bairro}
                        onChange={formik.handleChange('bairro')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Complemento"
                        viewOnly={viewOnly}
                        value={formik.values.complemento || ''}
                        erro={!!formik.errors.complemento && !!formik.touched.complemento}
                        onChange={formik.handleChange('complemento')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="E-mail"
                        viewOnly={viewOnly}
                        value={formik.values.email}
                        erro={!!formik.errors.email && !!formik.touched.email}
                        keyboardType="email-address"
                        onChange={formik.handleChange('email')}
                        />
                </View>
                <ButtonProgress
                    error={false}
                    onPressNext={formik.submitForm}
                    onPressPrevious={handleVoltar}
                />
            </ScrollView>
        </View>
    );
}

export default Endereco;
