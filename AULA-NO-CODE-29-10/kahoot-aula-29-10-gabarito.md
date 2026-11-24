# Kahoot · Aula 29/10 · Gabarito comentado

26 perguntas, 20 s cada. A explicação é para comentar depois de cada resposta.

**1. No-code elimina o quê?**

- A lógica do sistema
- ✅ A sintaxe do código
- O banco de dados
- A necessidade de testar

> A lógica continua sendo sua (quando, faça, só se). O que some é escrever a sintaxe.

**2. O que existe por trás dos blocos de uma plataforma no-code?**

- Nada, os blocos rodam sozinhos
- Só HTML
- ✅ Código, que roda em cima das camadas de baixo
- Uma planilha

> No-code é o topo da escada de abstração. Não substitui as camadas de baixo, roda em cima delas.

**3. Subir na escada de abstração (do Assembly ao no-code) troca...**

- ✅ Facilidade por controle e desempenho
- Segurança por velocidade
- Custo zero por custo alto
- Nada, só muda o nome

> Mais alto: mais rápido de criar. Mais baixo: mais controle e desempenho, mais trabalho.

**4. O que diferencia low-code de no-code?**

- Low-code é sempre mais barato
- Low-code não tem interface visual
- Low-code roda só no celular
- ✅ Low-code usa blocos + um pouco de código seu

> Ex.: OutSystems, Power Fx, Retool: blocos visuais e uma fórmula ou trecho escrito por você.

**5. Na analogia do garçom, o que a API faz?**

- Cozinha o prato
- ✅ Leva o pedido ao servidor e traz a resposta
- Guarda os dados para sempre
- Desenha a tela do app

> A API recebe o pedido em formato combinado (o cardápio) e devolve a resposta do sistema.

**6. No Bubble, se o data type é a tabela, o que é a thing?**

- Uma coluna
- A tabela inteira
- ✅ Uma linha (um registro)
- Um workflow

> Data type = planilha/tabela, field = coluna, thing = linha.

**7. Para que serve um option set, como a lista de Trilhas?**

- ✅ Lista fixa de opções definida por quem constrói
- Guardar os dados do usuário
- Agendar workflows
- Proteger campos sensíveis

> Option set é uma lista fixa que não muda com o uso do app.

**8. O que realmente muda entre IaaS, PaaS e SaaS?**

- A linguagem de programação
- Se roda no navegador ou no celular
- ✅ O que fica por sua conta e o que fica com o fornecedor
- O preço

> Quanto mais perto do SaaS, menos você administra e menos você controla.

**9. Alugar um servidor virtual na Hetzner e instalar tudo nele é...**

- ✅ IaaS
- PaaS
- SaaS
- iPaaS

> Você aluga a infraestrutura e cuida do sistema operacional e do que roda nele.

**10. Bubble e Lovable se encaixam melhor em qual categoria?**

- IaaS
- SaaS
- On-premise
- ✅ PaaS

> São plataformas onde você constrói e hospeda o seu app, sem cuidar de servidor.

**11. Make e n8n (na nuvem) são de que tipo?**

- IaaS
- ✅ iPaaS: integram e automatizam sistemas
- Banco de dados
- Software desktop

> iPaaS é a subcategoria de PaaS para integração e automação.

**12. Um app feito no Bubble só para uso interno da empresa é SaaS?**

- Sim, todo app na nuvem é SaaS
- Sim, porque o Bubble é SaaS
- ✅ Não, é uma aplicação sobre PaaS
- Não, é IaaS

> Vira SaaS quando é entregue como serviço, por assinatura, a vários clientes.

**13. O n8n instalado no seu próprio servidor é...**

- ✅ Self-hosted: você opera, atualiza e protege
- SaaS
- PaaS gerenciado
- Grátis e sem responsabilidade

> O mesmo software pode ser serviço na nuvem ou instalação própria. O que muda é quem opera.

**14. Mesmo usando um SaaS, os dados são responsabilidade...**

- Só do fornecedor
- Só do governo
- De ninguém
- ✅ Compartilhada: você decide o conteúdo e quem acessa

> O fornecedor guarda, mas o que entra e quem acessa é decisão sua.

**15. No Bubble, onde fica a proteção de verdade dos dados?**

- No filtro do Repeating Group
- No redirecionamento da página
- ✅ Nas privacy rules, no banco
- No nome secreto da página

> A página pode redirecionar quem não é admin, mas quem protege o dado é a privacy rule.

**16. Trocar o ID na URL e abrir o dado de outra pessoa é um exemplo de...**

- ✅ IDOR (falha de controle de acesso)
- Phishing
- Ataque DDoS
- Erro de DNS

> Acontece quando o servidor não confere se aquele usuário pode ver aquele registro.

**17. O que diz o princípio do menor privilégio?**

- Dar acesso total para evitar erros
- Usar a senha mais curta possível
- Só o admin usa o app
- ✅ Cada perfil recebe só o acesso necessário

> Comece fechando tudo e abra só o que cada perfil precisa.

**18. Por que a chave de API não pode ficar no código do navegador?**

- ✅ Qualquer pessoa pode ler esse código
- Deixa o app mais lento
- O navegador apaga a chave
- Só funciona no Chrome

> Guarde credenciais no servidor ou no cofre da ferramenta. Chave vazada: troque.

**19. Qual o risco de um webhook público sem autenticação?**

- Nenhum, a URL é secreta
- Ele para de funcionar
- Fica mais caro
- ✅ Qualquer um que descubra a URL pode dispará-lo

> Proteja com token ou validação de origem e use o mínimo de escopo nas conexões.

**20. Código gerado por IA que funciona é código seguro?**

- Sim, a IA já testou
- ✅ Não necessariamente: revise login, pagamentos e acesso
- Sim, se o app for pequeno
- Só se usar Supabase

> É comum vir com autenticação frágil, validação ausente ou RLS incompleta.

**21. Pela LGPD, quem constrói o app numa plataforma de terceiros...**

- Não tem responsabilidade
- Só responde se cobrar
- ✅ Também responde pelos dados coletados
- Passa a culpa à plataforma

> Colete só o necessário, tenha base legal e política de privacidade.

**22. Make cobra por ___; n8n por ___.**

- Usuário; mês
- Execução; passo
- ✅ Passo executado; execução do fluxo inteiro
- Tela; banco

> Um fluxo de 8 passos rodando 600 vezes: 4.800 créditos no Make, 600 execuções no n8n.

**23. Qual destes é um custo que costuma ser esquecido?**

- O preço do plano
- ✅ Renovação do domínio e backup
- O nome do app
- A cor do layout

> Também: e-mail profissional, IA dentro do app, câmbio e impostos, tempo de manutenção.

**24. Para que serve o DNS ao publicar um app com domínio próprio?**

- Criptografar a senha
- Guardar os dados do app
- ✅ Ligar o nome do domínio ao servidor do app
- Gerar o código do app

> O DNS aponta o nome (meuapp.com.br) para onde o app está. O HTTPS cuida da conexão segura.

**25. Qual a ideia central de um MVP?**

- Lançar só quando estiver perfeito
- ✅ Construir o menor produto que permita aprender com usuários reais
- Ter o máximo de funções
- Gastar o mínimo com segurança

> Construir, medir, aprender (Eric Ries). Segurança não entra no corte.

**26. No MoSCoW, o que significa o 'W'?**

- ✅ Won't: fica de fora desta versão
- Want: o que o cliente quer
- Work: o que dá trabalho
- Web: o que vai para a web

> Must, Should, Could, Won't: priorizar é decidir o que não fazer agora.
