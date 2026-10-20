# O Sapinho Comilão

Jogo infantil em um único arquivo HTML, com CSS e JavaScript integrados, sem dependências externas.

## Jogar

Abra `sapinho-comilao.html` em um navegador. Esse é o arquivo principal e a versão atual do jogo.

- Nove fases livres, incluindo o Fundo da Lagoa, a Travessia da Lagoa e a Travessia da Marginal, todas sem cronômetro. As sete aventuras originais têm percursos de cerca de 30 segundos andando para a direita.
- Na Travessia da Lagoa, pule entre vitórias-régias, folhas móveis e troncos até a outra margem. O percurso foi pensado para crianças de 7 anos, com duração aproximada de um minuto ao acertar os pulos.
- Colete mosquinhas e mosquinhas douradas. Cair na água devolve o sapinho à última folha segura, sem perder pontos nem vidas. O superpoder automático atrai alimentos e cria uma bolha que permite pisar na água por sete segundos.
- Na Travessia da Marginal, cada toque dá um pulinho em uma das quatro direções. Atravesse seis trechos com carros e ônibus, espere nos canteiros e colete mosquinhas nas áreas seguras. Colisões devolvem o sapinho ao último canteiro, sem perder pontos ou vidas. Quatro alimentos ativam sete segundos de trânsito lento; os veículos continuam sendo obstáculos.
- O cenário da Marginal é uma interpretação ilustrada da região da Ponte Estaiada, com rio, prédios, cabos da ponte, ciclovia, asfalto e veículos vistos de cima. Referência: [Ponte Octavio Frias de Oliveira, Prefeitura de São Paulo](https://www.prefeitura.sp.gov.br/web/comunicacao/w/noticias/125744).
- Os ícones das fases representam seus alimentos ou percursos: mosca, mosquito, grilo, mariposa, besouro, minhoca, camarão, vitória-régia e avenida.
- Oito personagens com guarda-roupa personalizável salvo no navegador: Dudu, Carol, Joca, Olivia, Rafa, Helena, Angela e Miguel.
- Rafa tem cachinhos ruivos volumosos, olhos azuis, sardinhas e um sorriso com dois dentinhos, inspirado no Dennis de Hotel Transilvânia. Helena tem tons de lavanda, olhos violetas e uma flor da lagoa, também disponível no guarda-roupa dos outros sapinhos.
- Angela é verde-clara, com olhos castanhos, cílios delicados e sorriso alegre. Seu visual inicial tem chapéu de peão marrom com abas curvas, camisa xadrez vermelha, jeans e botinhas marrons. As novas peças também estão disponíveis no guarda-roupa de todos os personagens.
- Miguel é uma criança de 10 anos e o cantor da turma: usa jaqueta de palco roxa com estrelas douradas, segura um microfone e aparece com cabelo azul-escuro cacheado. A música é representada visualmente no personagem, sem depender de arquivos de áudio externos.
- Dia, noite, chuva, sons sintetizados e superpoder automático.
- Escolha de fases após o look e botão para sair da fase; pontuações salvas por fase concluída.
- Controles de teclado e botões de toque.

## Teclado

| Comando | Tecla |
| --- | --- |
| Andar | Setas esquerda/direita ou A/D |
| Pular | Espaço, W ou seta para cima |
| Pular na Marginal | Setas ou WASD; espaço também avança. Um pulo por toque. |
| Coaxar | X |
| Dia/noite | N |
| Chuva | C |
| Ligar/desligar som | M |

## Desenvolvimento

Edite `sapinho-comilao.html` e recarregue o navegador. Não há instalação nem etapa de compilação.

Para verificar as travessias, colisões, controles, superpoderes, fases originais e personagens salvos, execute `node --test tests/*.test.cjs` (Node.js, sem dependências).

## Publicação

O workflow `.github/workflows/pages.yml` publica automaticamente o jogo no GitHub Pages quando o HTML é atualizado em `main`. Ele copia somente `sapinho-comilao.html` para `index.html` na pasta publicada. Ative Pages em Settings → Pages, com a origem GitHub Actions.

Os arquivos em `dist/` e `.openai/` vieram da configuração inicial e não são utilizados nessa publicação.
