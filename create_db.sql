CREATE TABLE Endereco (
	id int AUTO_INCREMENT PRIMARY KEY,
	pais char(3) NOT NULL,
    uf char(2) NOT NULL,
    municipio varchar(255) NOT NULL,
    numero int NOT NULL,
    zona_urbana boolean NOT NULL default true,
    bairro varchar(255) NOT NULL,
    logradouro varchar(255) NOT NULL,
    complemento varchar(255)
);

CREATE TABLE Raca (
	id int AUTO_INCREMENT PRIMARY KEY,
    raca varchar(20) not null
);

CREATE TABLE Grupo_Atendimento (
	id int AUTO_INCREMENT PRIMARY KEY,
    grupo varchar(20) not null
);

CREATE table Paciente (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL,
    CPF char(11) UNIQUE,
    CNS varchar(20) UNIQUE,
    email varchar(255),
    telefone bigint NOT NULL,
    sexo boolean NOT NULL,
    nome_da_mae varchar(255) NOT NULL,
    raca int NOT NULL,
    nome_social varchar(255),
    gestante boolean NOT NULL default FALSE,
    puerpera boolean NOT NULL default FALSE,
    grupo_de_atendimento int NOT NULL,
    estado_dose_1 char(2),
    nascimento date NOT NULL,
    endereco int not null,
    FOREIGN KEY (raca) REFERENCES Raca(id),
    FOREIGN KEY (grupo_de_atendimento) REFERENCES Grupo_Atendimento(id),
    FOREIGN KEY (endereco) REFERENCES Endereco(id)
);

CREATE TABLE Imunobiologico (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL UNIQUE,
    numero_doses tinyint NOT NULL,
    aprazamento int
);

CREATE TABLE Hospital (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL
);

CREATE TABLE Vacinador (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL,
    hospital int,
    FOREIGN KEY (hospital) REFERENCES Hospital(id)
);

CREATE TABLE Estrategia (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL UNIQUE
);

CREATE TABLE Via_Administracao (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL UNIQUE
);

CREATE TABLE Local_Administracao (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL UNIQUE
);

CREATE TABLE Registro_Vacinacao (
	id int AUTO_INCREMENT PRIMARY KEY,
    numero_dose tinyint NOT NULL,
    estrategia int NOT NULL,
    via_administracao int NOT NULL,
    local_administracao int NOT NULL,
    data_aplicacao date NOT NULL,
    paciente int NOT NULL,
    vacinador int NOT NULL,
    hospital int NOT NULL,
    FOREIGN KEY (paciente) REFERENCES Paciente(id),
    FOREIGN KEY (vacinador) REFERENCES Vacinador(id),
    FOREIGN KEY (hospital) REFERENCES Hospital(id),
    FOREIGN KEY (estrategia) REFERENCES Estrategia(id),
    FOREIGN KEY (via_administracao) REFERENCES Via_Administracao(id),
    FOREIGN KEY (local_administracao) REFERENCES Local_Administracao(id),
    UNIQUE KEY (numero_dose, paciente)
);
