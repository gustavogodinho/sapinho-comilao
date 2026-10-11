# O Sapinho Comilão

Jogo infantil em um único arquivo HTML, com CSS e JavaScript integrados, sem dependências externas.

## Jogar

Abra `sapinho-comilao.html` em um navegador. Esse é o arquivo principal e a versão atual do jogo.

- Sete fases livres, incluindo o Fundo da Lagoa, com largada e chegada em percursos de cerca de 30 segundos andando para a direita, sem cronômetro.
- Dudu, Carol, Joca e Olivia com guarda-roupa personalizável salvo no navegador.
- Dia, noite, chuva, sons sintetizados e superpoder automático.
- Escolha de fases após o look e botão para sair da fase; pontuações salvas por fase concluída.
- Controles de teclado e botões de toque.

## Teclado

| Comando | Tecla |
| --- | --- |
| Andar | Setas esquerda/direita ou A/D |
| Pular | Espaço, W ou seta para cima |
| Coaxar | X |
| Dia/noite | N |
| Chuva | C |
| Ligar/desligar som | M |

## Desenvolvimento

Edite `sapinho-comilao.html` e recarregue o navegador. Não há instalação nem etapa de compilação.

## Publicação

O workflow `.github/workflows/pages.yml` publica automaticamente o jogo no GitHub Pages quando o HTML é atualizado em `main`. Ele copia somente `sapinho-comilao.html` para `index.html` na pasta publicada. Ative Pages em Settings → Pages, com a origem GitHub Actions.

Os arquivos em `dist/` e `.openai/` vieram da configuração inicial e não são utilizados nessa publicação.
