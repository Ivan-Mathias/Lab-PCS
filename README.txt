===========================
Projeto Vacivida - Grupo 10
===========================

Desenvolvido por:
- Airton de Souza Oliveira (10773075)
- Fernando Kurike Matsumoto (10774097)
- Giovanni Cabral Morales (10770583)
- Ivan Mathias Sant Anna e Silva (10773586)
- Rafael Araujo Coelho (10773252)

Identificação
-------------
Este projeto é desenvolvido em conjunto com para as disciplinas
PCS3443 - Laboratório de Engenharia de Software I e PCS3434 -
Laboratório de Redes de Computadores. Ele tem como tema o sistema
de vacinação do VaciVida.

O objetivo do grupo é agilizar o processo de cadastramento de
pacientes no momento da vacina, principalmente quando a conexão
com o servidor estiver instável ou fora do ar.

A solução proposta é utilizar algoritmos de visão computacional
(Reconhecimento Óptico de Caracteres - OCR) para extrair os dados
dos clientes a partir de fotos de seus documentos (e.g. RG e CNH),
as quais serão obtidas e submetidas à correção da perspectiva a
partir da câmera do dispositivo utilizado pelo vacinador (tablet).
Além disso, os dados serão armazenados localmente e ficarão salvos
no tablet pelo menos até que seja possível sincronizar com o
servidor de homologação (do Vacivida) assim que uma conexão
for estabelecida.

Plataforma
----------
O aplicativo foi desenvolvido para ser executado em dispositivos
móveis, por meio do React Native. No entanto, uma incompatibilidade
entre o framework utilizado para criar o aplicativo e a biblioteca
de OCR utilizadas fez com que a biblioteca de OCR não pudesse ser
executada em dispositivos móveis. Portanto, optou-se por desenvolver
uma primeira versão da solução apenas para navegadores web.

Requisitos
----------
Para executar o projeto, é necessário ter o Node.js
<https://nodejs.org/en/download/> instalado em sua máquina. Após
instalar o Node.js, instale também o Expo CLI:

    npm install --global expo-cli

Além disso, é necessário ter uma cópia local do repositório do
aplicativo, disponível em <https://github.com/Ivan-Mathias/Lab-PCS>.

Execução
--------
Primeiramente, entre na pasta "vacivida" do repositório e execute:

    npm install
    npm start -- --web

Após a execução desses comandos, serão abertas duas abas em seu
navegador web: "Expo Developer Tools" e uma tela com o aplicativo
(essa tela pode demorar alguns minutos para aparecer).

Obs: preferencialmente, não utilize o Mozilla Firefox pois ele
pode não interagir corretamente com a sua câmera.
