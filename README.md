# DevForge

Rede social para programadores com comunidades, mensagens, perfil-portfolio e persistencia local em SQLite.

## Rodar localmente

```bash
node server.js
```

Abra `http://127.0.0.1:3000/`.

Conta demo:

- usuario: `lucassilva`
- senha: `123456`

## Deploy real

Este projeto foi preparado para deploy simples em host Node.

### Render

1. Importe este repositório no Render.
2. Escolha `Blueprint` se ele detectar o arquivo `render.yaml`.
3. O app vai subir com `npm start`.
4. No plano `free`, o SQLite roda em filesystem efemero.

### Variaveis de ambiente

- `PORT`: porta HTTP fornecida pelo host
- `HOST`: padrao `0.0.0.0`
- `DATA_DIR`: diretorio onde o SQLite sera salvo
- `DB_PATH`: opcional, sobrescreve o caminho completo do banco

## Observacao importante

O projeto usa `node:sqlite`, que exige Node 24 ou superior.

### Persistencia no plano free

No Render free, os dados do SQLite podem ser perdidos quando o servico reiniciar, dormir ou fizer redeploy.

Isso serve para demonstracao e teste online.

Se voce quiser persistencia real depois, o proximo passo e:

- usar um plano com disco persistente
- ou migrar o backend para Postgres
