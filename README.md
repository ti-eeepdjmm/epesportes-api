# EPesportes App

## Visão Geral
O **EPesportes** é um aplicativo desenvolvido para acompanhar os jogos interclasses e os esportes de uma escola. Ele proporciona uma experiência interativa para os usuários, permitindo o acompanhamento em tempo real de campeonatos, estatísticas, vídeos, fotos e interações entre usuários e atletas.

## Objetivos do Projeto
- Criar uma plataforma interativa para acompanhamento dos jogos interclasses.
- Permitir autenticação e interação entre usuários e atletas.
- Exibir tabela de classificação e estatísticas detalhadas.
- Disponibilizar vídeos e fotos dos eventos esportivos.
- Implementar um feed em tempo real com envio de mídia.
- Criar um sistema de reações personalizadas para interações.
- Permitir cadastro de usuários, partidas, escalações e times.
- Monitorar e observar métricas do sistema com Grafana.

## Tecnologias Utilizadas
### **Frontend**
- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)

### **Backend**
- [Node.js](https://nodejs.org/) com [NestJS](https://nestjs.com/)
- Banco de dados: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- Banco de dados dinâmico: [MongoDB](https://www.mongodb.com/)
- Autenticação segura com JWT e Supabase
- Observabilidade e métricas com [Grafana](https://grafana.com/) e ferramentas adicionais

## Estrutura do Projeto
```
EPesportes/
│── src/            # API em Node.js com NestJS
│── .gitignore
│── README.md           # Este arquivo
│── package.json
│── LICENSE
```

## Como Rodar o Projeto
### **1. Clonar o repositório**
```sh
git clone https://github.com/seu-usuario/EPesportes.git
cd EPesportes
```

### **2. Configurar o Backend**
```sh
cd backend
npm install
npm run start
```

### **3. Configurar o Frontend**
```sh
cd frontend
npm install
expo start
```

## Roadmap de Desenvolvimento
- [x] Definição e modelagem do banco de dados
- [x] Desenvolvimento da API e integração com Supabase e MongoDB
- [ ] Implementação das principais funcionalidades
- [ ] Testes, ajustes e otimização de performance
- [ ] Monitoramento e implantação

## Contribuição
Pull Requests são bem-vindos! Siga as diretrizes:
1. Crie um branch para sua funcionalidade (`git checkout -b feature-minha-feature`)
2. Faça commits (`git commit -m "Adiciona nova funcionalidade"`)
3. Faça push (`git push origin feature-minha-feature`)
4. Abra um Pull Request

## Licença
Este projeto é licenciado. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

