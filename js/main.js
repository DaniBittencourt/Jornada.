
document.addEventListener("DOMContentLoaded", () => {

  // Botão voltar ao topo

  const botaoTopo = document.getElementById("voltar-topo");

  if (botaoTopo) {
    const atualizarBotaoTopo = () => {
      botaoTopo.classList.toggle(
        "visivel",
        window.scrollY > 300
      );
    };

    window.addEventListener("scroll", atualizarBotaoTopo, {
      passive: true
    });

    atualizarBotaoTopo();

    botaoTopo.addEventListener("click", () => {
      const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reduzirMovimento ? "auto" : "smooth"
      });
    });
  }

  // Pesquisa de assuntos

  const formulario = document.getElementById("form-busca");
  const campo = document.getElementById("campo-busca");
  const resultados = document.getElementById("resultados-busca");

  if (formulario && campo && resultados) {

    const assuntos = [
      {
        titulo: "Gestação, parto e pós-parto",
        palavras: "gravidez gestante gestação parto cesárea pós-parto bebê sintomas pré-natal recuperação",
        link: "fases.html"
      },
      {
        titulo: "Direitos durante a maternidade",
        palavras: "direitos lei licença maternidade acompanhante trabalho sus atendimento consentimento",
        link: "direitos.html"
      },
      {
        titulo: "Dúvidas frequentes",
        palavras: "dúvidas perguntas amamentação leite enjoo sintomas alimentação cuidados exames",
        link: "duvidas.html"
      },
      {
        titulo: "Rede de apoio",
        palavras: "apoio psicológico saúde mental ansiedade tristeza ajuda família serviços violência",
        link: "apoio.html"
      },
      {
        titulo: "Acolhimento após uma perda",
        palavras: "perda gestacional fetal aborto espontâneo luto morte bebê neonatal recuperação acolhimento",
        link: "perda.html"
      }
    ];

    const normalizar = (texto) => {
      return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const pesquisa = normalizar(campo.value.trim());

      resultados.replaceChildren();

      if (!pesquisa) return;

      const termos = pesquisa.split(/\s+/);

      const encontrados = assuntos.filter((assunto) => {
        const conteudo = normalizar(
          `${assunto.titulo} ${assunto.palavras}`
        );

        return termos.every((termo) =>
          conteudo.includes(termo)
        );
      });

      if (encontrados.length === 0) {
        const mensagem = document.createElement("p");

        mensagem.textContent =
          "Não encontramos um assunto correspondente. Tente pesquisar com outras palavras.";

        resultados.appendChild(mensagem);
        return;
      }

      encontrados.forEach((assunto) => {
        const link = document.createElement("a");

        link.href = assunto.link;
        link.className = "resultado-item";

        const titulo = document.createElement("strong");
        titulo.textContent = assunto.titulo;

        const descricao = document.createElement("span");
        descricao.textContent = "Acessar conteúdo";

        link.append(titulo, descricao);
        resultados.appendChild(link);
      });
    });
  }
});


// Preferências simples de acessibilidade
// As escolhas ficam salvas neste navegador.
document.addEventListener('DOMContentLoaded', () => {
  const raiz = document.documentElement;
  const painel = document.getElementById('painel-acessibilidade');
  const botao = document.querySelector('.botao-acessibilidade');
  if (!painel || !botao) return;

  const tamanhoSalvo = localStorage.getItem('jornada-tamanho') || 'normal';
  const contrasteSalvo = localStorage.getItem('jornada-contraste') === 'sim';

  function aplicarTamanho(tamanho) {
    raiz.classList.toggle('texto-maior', tamanho === 'maior');
    raiz.classList.toggle('texto-extra', tamanho === 'extra');
    painel.querySelectorAll('[data-tamanho]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item.dataset.tamanho === tamanho));
    });
  }

  function aplicarContraste(ativo) {
    raiz.classList.toggle('alto-contraste', ativo);
    document.getElementById('alternar-contraste')
      .setAttribute('aria-pressed', String(ativo));
  }

  aplicarTamanho(tamanhoSalvo);
  aplicarContraste(contrasteSalvo);

  botao.addEventListener('click', () => {
    painel.hidden = !painel.hidden;
    botao.setAttribute('aria-expanded', String(!painel.hidden));
  });

  painel.querySelectorAll('[data-tamanho]').forEach((item) => {
    item.addEventListener('click', () => {
      localStorage.setItem('jornada-tamanho', item.dataset.tamanho);
      aplicarTamanho(item.dataset.tamanho);
    });
  });

  document.getElementById('alternar-contraste').addEventListener('click', () => {
    const ativo = !raiz.classList.contains('alto-contraste');
    localStorage.setItem('jornada-contraste', ativo ? 'sim' : 'nao');
    aplicarContraste(ativo);
  });
});
