# Backlog de integracoes (Leeshmo)

Prioridade sugerida e criterios de aceite curtos para evoluir o MVP.

## P0 — Dados e confianca

- **Analytics real (GA4 / Meta / LinkedIn)**  
  - **Aceite:** conectar pelo menos uma fonte; exibir pelo menos um KPI nao-mock na rota Metricas; falha de token mostra estado degradado, nao erro branco.

- **Webhook n8n (entrada/saida)**  
  - **Aceite:** endpoint autenticado (segredo ou assinatura); payload versionado; pagina Automacao reflete conectado/desconectado.

## P1 — Produto

- **Calendario editorial sincronizado**  
  - **Aceite:** criar item no app persiste e reaparece apos reload; opcional export ICS.

- **Biblioteca de conteudo**  
  - **Aceite:** listar rascunhos do Neon por usuario; edicao basica local ou server.

## P2 — Operacao

- **Alertas por email (Resend / similar)**  
  - **Aceite:** evento de geracao ou marco dispara email de teste em staging.

- **Observabilidade**  
  - **Aceite:** logs estruturados nas rotas de API criticas; erro 5xx com request id.

---

*Atualizado com o escopo do roadmap interno; ajustar datas e owners no board de projeto.*
