export type Paciente = {
    id: number,
    nome: string,
    cpf: number,
    cns: number,
    telefone: number,
    nascimento: string,
    sexo: string,
    raca: string,
    gestante: boolean,
    puerpera: boolean,
    nomeSocial: string,
    nomeDaMae: string,
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
    segundaDose: boolean,
    lote: number
}

export default Paciente
