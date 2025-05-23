📞 ## Sistema de Suporte Técnico em TI com CI/CD
Este é um sistema web para gestão de atendimentos técnicos em TI, 
permitindo que usuários realizem login, cadastrem contas e agendem 
atendimentos técnicos de forma prática e eficiente.
O projeto foi desenvolvido utilizando práticas modernas de Integração Contínua (CI) 
e Entrega Contínua (CD), com foco em automação, escalabilidade e organização. ##

# ✅ Funcionalidades
# ✅ Login de Usuário.

# ✅ Cadastro de nova conta.

# ✅ Agendamento de atendimento técnico.

# ✅ Listagem de agendamentos realizados.

# ✅ Containerização com Docker.

# ✅ Orquestração com Kubernetes.

# ✅ Pipeline de CI/CD com Jenkins.

# 🚀 Tecnologias Utilizadas
🔹 Frontend
HTML5

CSS3

JavaScript

🔹 Backend
Node.js

Express.js

MySQL

🔹 Banco de Dados
MySQL

🔹 DevOps
Docker

Docker Compose

Kubernetes

Jenkins

# ESTRUTURA DO PROJETO

 suporte-ti-agendamento/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
├── frontend/
│   ├── login.html
│   ├── agendamento.html
├── k8s/
│   ├── app-deployment.yaml
│   ├── mysql-deployment.yaml
├── docker-compose.yml
├── Jenkinsfile
└── README.md


# BANCO DE DADOS MYSQL

- CREATE DATABASE suporte_ti;

- USE suporte_ti;

- CREATE TABLE usuarios (
    - id INT AUTO_INCREMENT PRIMARY KEY,
   - nome VARCHAR(100),
   - email VARCHAR(100),
   - senha VARCHAR(100)
-);

-CREATE TABLE agendamentos (
  -  id INT AUTO_INCREMENT PRIMARY KEY,
   - usuario_id INT,
   - data DATETIME,
   - descricao TEXT,
   - FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
-);

# ➡️ Tela de Login
- Acesse:
http://localhost:3000/login

# ➡️ Tela de Agendamento
- Acesse:
http://localhost:3000/agendar