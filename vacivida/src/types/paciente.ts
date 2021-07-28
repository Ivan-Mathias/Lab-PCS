export type Paciente = {
    id: number,
    nome: string,
    cpf: number,
    cns: number,
    telefone: number,
    nascimento: string,
    sexo: string,
    raca: string,
    gestante: string,
    puerpera: string,
    nome_social: string,
    nome_da_mae: string,
    pais: string,
    uf: string,
    municipio: string,
    zona: string,
    logradouro: string,
    numero: number,
    bairro: string,
    complemento: string,
    email: string,
    imunobiologico: string,
    data: string,
    segunda_dose: string,
    lote: number
}

export default Paciente
