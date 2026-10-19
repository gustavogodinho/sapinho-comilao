# O Sapinho Comilão

Jogo infantil em um único arquivo HTML, com CSS e JavaScript integrados, sem dependências externas.

## Jogar

Abra `sapinho-comilao.html` em um navegador. Esse é o arquivo principal e a versão atual do jogo.

- Oito fases livres, incluindo o Fundo da Lagoa e a Travessia da Lagoa, todas sem cronômetro. As sete aventuras originais têm percursos de cerca de 30 segundos andando para a direita.
- Na Travessia da Lagoa, pule entre vitórias-régias, folhas móveis e troncos até a outra margem. O percurso foi pensado para crianças de 7 anos, com duração aproximada de um minuto ao acertar os pulos.
- Colete mosquinhas e mosquinhas douradas. Cair na água devolve o sapinho à última folha segura, sem perder pontos nem vidas. O superpoder automático atrai alimentos e cria uma bolha que permite pisar na água por sete segundos.
- Seis personagens com guarda-roupa personalizável salvo no navegador: Dudu, Carol, Joca, Olivia, Rafa e Helena.
- Rafa tem cachinhos ruivos volumosos, olhos azuis, sardinhas e um sorriso com dois dentinhos, inspirado no Dennis de Hotel Transilvânia. Helena tem tons de lavanda, olhos violetas e uma flor da lagoa, também disponível no guarda-roupa dos outros sapinhos.
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

Para verificar a física da travessia, as fases originais e os personagens salvos, execute `node --test tests/travessia.test.cjs` (Node.js, sem dependências).

## Publicação

O workflow `.github/workflows/pages.yml` publica automaticamente o jogo no GitHub Pages quando o HTML é atualizado em `main`. Ele copia somente `sapinho-comilao.html` para `index.html` na pasta publicada. Ative Pages em Settings → Pages, com a origem GitHub Actions.

Os arquivos em `dist/` e `.openai/` vieram da configuração inicial e não são utilizados nessa publicação.
