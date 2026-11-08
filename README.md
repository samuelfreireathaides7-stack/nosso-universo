# Nosso Universo

Uma experiência romântica estática feita com HTML, CSS e JavaScript puros. Não precisa de Node.js, backend ou banco de dados.

## Personalizar

1. Abra `config.js` e preencha `relationshipStart` com a data real, em `AAAA-MM-DD` ou ISO 8601. O contador permanece oculto até a data ser válida.
2. O álbum de fotografias é organizado em `album-manifest.json`. Coloque as imagens em `assets/fotos/`, os vídeos em `assets/videos/` e as capas correspondentes em `assets/capas-videos/`; mantenha os nomes e a ordem definidos no manifesto ou personalize títulos e textos diretamente nele.
3. Atualize os 20 textos em `reasons`, as entradas de `smallWorld` e os parágrafos de `letter` com as memórias de vocês.
4. Coloque a música escolhida em `assets/audio/nossa-musica.mp3`. A reprodução só começa após tocar no controle; sem o arquivo, o site continua funcionando.

Para cada lembrança do álbum, o manifesto aceita os caminhos relativos em `fotos` e `videos`, além de `titulo`, `texto` e `layout`. As miniaturas são associadas pela chave em `capas_videos`. Os vídeos só recebem a origem e começam a carregar quando a pessoa toca em reproduzir.

Exemplo de conteúdo para uma memória no `album-manifest.json`:

```json
{
  "id": "01",
  "titulo": "Um título personalizável",
  "texto": "Uma pequena mensagem para esta página.",
  "layout": "duas-fotos",
  "fotos": ["24293.jpg", "4042.jpg"],
  "videos": []
}
```

Os textos existentes no manifesto são sugestões e não incluem datas ou acontecimentos confirmados. Os cartões de `smallWorld` continuam sendo exemplos sinalizados na página, não conversas nem fatos reais. Nenhuma informação pessoal foi inventada.

Como o navegador protege arquivos JSON locais, o álbum não carrega quando `index.html` é aberto diretamente por `file://`. Teste pelo GitHub Pages ou por qualquer servidor HTTP estático; o projeto publicado não exige Node.js.

## GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos desta pasta usando o método de sua preferência. Nada é publicado automaticamente por este projeto.
2. Confirme que `index.html` está na raiz do repositório e que todos os recursos usam caminhos relativos.
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**, escolha a branch desejada e a pasta **/(root)**, e salve.
5. Aguarde a publicação do GitHub Pages. O endereço terá o formato `https://usuario.github.io/nome-do-repositorio/`.

O arquivo principal já está nomeado `index.html`, inclusive para hospedagem em sistemas sensíveis a maiúsculas e minúsculas.