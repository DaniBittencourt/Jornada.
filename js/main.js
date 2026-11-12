
document.addEventListener("DOMContentLoaded", () => {

  // Descrição das ilustrações ao passar o mouse ou usar o teclado.
  const ilustracoes = document.querySelectorAll("img[data-descricao]");

  if (ilustracoes.length) {
    const dica = document.createElement("div");
    dica.className = "tooltip-ilustracao";
    dica.id = "descricao-imagem-ativa";
    dica.setAttribute("role", "tooltip");
    dica.hidden = true;
    document.body.appendChild(dica);

    const posicionarDica = (imagem) => {
      const area = imagem.getBoundingClientRect();
      const largura = dica.offsetWidth;
      const altura = dica.offsetHeight;
      const centro = area.left + area.width / 2;
      const esquerda = Math.max(12, Math.min(centro - largura / 2, window.innerWidth - largura - 12));
      const acima = area.top - altura - 10;
      const topo = acima >= 12 ? acima : Math.min(area.bottom + 10, window.innerHeight - altura - 12);
      dica.style.left = `${esquerda}px`;
      dica.style.top = `${Math.max(12, topo)}px`;
    };

    const mostrarDica = (imagem) => {
      dica.textContent = imagem.dataset.descricao;
      dica.hidden = false;
      imagem.setAttribute("aria-describedby", dica.id);
      posicionarDica(imagem);
    };

    const ocultarDica = (imagem) => {
      dica.hidden = true;
      imagem.removeAttribute("aria-describedby");
    };

    ilustracoes.forEach((imagem) => {
      imagem.addEventListener("mouseenter", () => mostrarDica(imagem));
      imagem.addEventListener("mouseleave", () => ocultarDica(imagem));
      imagem.addEventListener("focus", () => mostrarDica(imagem));
      imagem.addEventListener("blur", () => ocultarDica(imagem));
      imagem.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") ocultarDica(imagem);
      });
    });
    window.addEventListener("resize", () => {
      const imagemAtiva = document.activeElement;
      if (!dica.hidden && imagemAtiva?.matches?.("img[data-descricao]")) posicionarDica(imagemAtiva);
    });
  }

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
  
  // Fecha o painel com Esc e devolve o foco ao botão de acessibilidade.
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !painel.hidden) {
      painel.hidden = true;
      botao.setAttribute('aria-expanded', 'false');
      botao.focus();
    }
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
