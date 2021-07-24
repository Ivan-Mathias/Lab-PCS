import { useFormik } from 'formik';
import React from 'react';
import { ScrollView, View } from 'react-native';
import ButtonProgress from '../../../components/ButtonProgress';
import OutlinedTextInput from '../../../components/OutlinedTextInput';
import { styles } from '../styles';

interface EtapaEnderecoProps {
    initialValues?: DadosEndereco;
    handleVoltar: () => void;
    handleSubmit: (dados: DadosEndereco) => void;
}

export type DadosEndereco = {
    nomeSocial: string;
    nomeDaMae: string;
    pais: string;
    uf: number;
    municipio: string;
    zona: string;
    logradouro: string;
    numero: number;
    bairro: string;
    complemento?: string;
    email: string;
}

function Endereco ({ initialValues, handleVoltar, handleSubmit }: EtapaEnderecoProps) {
    const formik = useFormik({
        initialValues: initialValues
        ? initialValues
        : {
            nomeSocial: '',
            nomeDaMae: '',
            pais: '',
            uf: 0,
            municipio: '',
            zona: '',
            logradouro: '',
            numero: 0,
            bairro: '',
            complemento: '',
            email: ''
        },
        onSubmit: (values) => handleSubmit(values)
    })

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Nome social"
                        value={formik.values.nomeSocial}
                        onChange={formik.handleChange('nomeSocial')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Nome da mãe"
                        value={formik.values.nomeDaMae}
                        onChange={formik.handleChange('nomeDaMae')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="País"
                        value={formik.values.pais}
                        onChange={formik.handleChange('pais')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="UF"
                        value={formik.values.uf}
                        onChange={formik.handleChange('uf')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Município"
                        value={formik.values.municipio}
                        onChange={formik.handleChange('municipio')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Zona"
                        value={formik.values.zona}
                        onChange={formik.handleChange('zona')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Logradouro"
                        value={formik.values.logradouro}
                        onChange={formik.handleChange('logradouro')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Número"
                        keyboardType="numeric"
                        value={formik.values.numero}
                        onChange={formik.handleChange('numero')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="Bairro"
                        value={formik.values.bairro}
                        onChange={formik.handleChange('bairro')}
                        />
                    <View style={styles.espacador}/>
                    <OutlinedTextInput
                        label="Complemento"
                        value={formik.values.complemento || ''}
                        onChange={formik.handleChange('complemento')}
                        />
                </View>
                <View style={styles.linha}>
                    <OutlinedTextInput
                        label="E-mail"
                        value={formik.values.email}
                        keyboardType="email-address"
                        onChange={formik.handleChange('email')}
                        />
                </View>
            </ScrollView>
            <ButtonProgress
                error={false}
                onPressNext={formik.submitForm}
                onPressPrevious={handleVoltar}
            />
        </View>
    );
}

export default Endereco;
