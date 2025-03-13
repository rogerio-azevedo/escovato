# Escovato - Salão de Beleza Express

Este é o site oficial do Escovato, um salão de beleza express que oferece serviços rápidos e de alta qualidade, sem necessidade de agendamento.

## Tecnologias Utilizadas

- [Next.js 15](https://nextjs.org/) - Framework React para desenvolvimento web
- [React 19](https://react.dev/) - Biblioteca JavaScript para construção de interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Tailwind CSS 4](https://tailwindcss.com/) - Framework CSS utilitário

## Características

- Design responsivo para todos os dispositivos
- Animações suaves e transições elegantes
- Carrossel de imagens
- Seções interativas
- Integração com Google Maps
- Botão flutuante para WhatsApp

## Estrutura do Projeto

```
escovato/
├── public/              # Arquivos estáticos
│   ├── images/          # Imagens do site
│   │   └── logo.svg         # Logo principal
│   └── logo-white.svg   # Logo para fundo escuro
├── src/                 # Código fonte
│   ├── app/             # Diretório principal do Next.js
│   │   ├── globals.css  # Estilos globais
│   │   ├── layout.tsx   # Layout principal
│   │   └── page.tsx     # Página inicial
│   └── components/      # Componentes React
│       ├── Header.tsx   # Cabeçalho
│       ├── Footer.tsx   # Rodapé
│       ├── WhatsAppButton.tsx # Botão flutuante de WhatsApp
│       ├── SectionObserver.tsx # Animação de seções
│       └── sections/    # Seções da página
│           ├── Hero.tsx         # Seção principal
│           ├── NossoEspaco.tsx  # Seção "Nosso Espaço"
│           ├── Profissionais.tsx # Seção "Profissionais"
│           ├── Servicos.tsx     # Seção "Serviços"
│           └── Localizacao.tsx  # Seção "Localização"
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```

## Executando o Projeto

### Pré-requisitos

- Node.js 18.17 ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/escovato.git
   cd escovato
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

3. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Construção para Produção

```bash
npm run build
# ou
yarn build
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Contato

Escovato - [contato@escovato.com.br](mailto:contato@escovato.com.br)

---

Desenvolvido com ❤️ para o Escovato
