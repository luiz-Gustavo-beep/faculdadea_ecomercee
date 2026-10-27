
const listaVeiculos = document.getElementById("lista-veiculos");
const estadoCatalogo = document.getElementById("estado-catalogo");

const LIMITE_FOTOS = 6;

let modalInteresse = null;
let formularioInteresse = null;
let mensagemFormulario = null;
let botaoEnviarFormulario = null;
let veiculoSelecionado = null;

async function buscarImagensDoVeiculo(veiculoId) {
    try {
        const resposta = await fetch(`/imagens/veiculo/${veiculoId}`);

        if (!resposta.ok) {
            console.error("Não foi possível carregar as imagens do veículo.");
            return [];
        }

        const imagens = await resposta.json();

        if (!Array.isArray(imagens)) {
            return [];
        }

        return imagens
            .filter(imagem => imagem.url)
            .slice(0, LIMITE_FOTOS);
    } catch (erro) {
        console.error("Erro ao buscar imagens:", erro);
        return [];
    }
}

function criarBotaoCarrossel(texto, descricao, classe, acao) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = texto;
    botao.className = classe;
    botao.setAttribute("aria-label", descricao);
    botao.addEventListener("click", acao);

    return botao;
}

function criarCarrossel(veiculo, imagens) {
    const areaImagem = document.createElement("div");
    areaImagem.className = "imagem-veiculo";

    if (!imagens.length) {
        areaImagem.textContent = "Foto do veículo indisponível";
        return areaImagem;
    }

    let indiceAtual = 0;
    let contador = null;

    const foto = document.createElement("img");

    foto.alt = `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""}`.trim();
    foto.loading = "lazy";

    areaImagem.appendChild(foto);

    function atualizarCarrossel() {
        foto.src = imagens[indiceAtual].url;
        foto.alt =
            `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""} - ` +
            `Foto ${indiceAtual + 1} de ${imagens.length}`;

        if (contador) {
            contador.textContent = `${indiceAtual + 1} / ${imagens.length}`;
        }
    }

    foto.addEventListener("error", () => {
        foto.alt = "Não foi possível carregar esta foto";
    });

    if (imagens.length > 1) {
        const anterior = criarBotaoCarrossel(
            "❮",
            "Foto anterior",
            "seta-carrossel anterior",
            () => {
                indiceAtual =
                    (indiceAtual - 1 + imagens.length) % imagens.length;

                atualizarCarrossel();
            }
        );

        const proxima = criarBotaoCarrossel(
            "❯",
            "Próxima foto",
            "seta-carrossel proxima",
            () => {
                indiceAtual = (indiceAtual + 1) % imagens.length;
                atualizarCarrossel();
            }
        );

        contador = document.createElement("span");
        contador.className = "contador-carrossel";

        areaImagem.append(anterior, proxima, contador);
    }

    atualizarCarrossel();

    return areaImagem;
}

function formatarPreco(preco) {
    if (preco == null || preco === "") {
        return "Consulte o preço";
    }

    const valor = Number(preco);

    if (!Number.isFinite(valor)) {
        return "Consulte o preço";
    }

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function criarCartaoVeiculo(veiculo, imagens) {
    const cartao = document.createElement("article");
    cartao.className = "card-veiculo";

    const areaImagem = criarCarrossel(veiculo, imagens);

    const informacoes = document.createElement("div");
    informacoes.className = "info-veiculo";

    const titulo = document.createElement("h3");
    titulo.textContent =
        `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""}`.trim();

    const ano = document.createElement("p");
    ano.className = "ano-veiculo";
    ano.textContent = veiculo.ano ?? "Ano não informado";

    const preco = document.createElement("p");
    preco.className = "preco-veiculo";
    preco.textContent = formatarPreco(veiculo.preco);

    const descricao = document.createElement("p");
    descricao.className = "descricao-veiculo";
    descricao.textContent = veiculo.descricao ?? "";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-veiculo";
    botao.textContent = "Tenho interesse";

    botao.addEventListener("click", () => {
        abrirFormularioInteresse(veiculo);
    });

    informacoes.append(titulo, ano, preco, descricao, botao);
    cartao.append(areaImagem, informacoes);

    return cartao;
}

/* Cria a janela de interesse */
function criarModalInteresse() {
    if (modalInteresse) {
        return;
    }

    modalInteresse = document.createElement("div");
    modalInteresse.className = "modal-interesse";
    modalInteresse.setAttribute("aria-hidden", "true");

    modalInteresse.innerHTML = `
        <div class="conteudo-modal-interesse"
             role="dialog"
             aria-modal="true"
             aria-labelledby="titulo-modal-interesse">

            <button type="button"
                    class="fechar-modal-interesse"
                    aria-label="Fechar formulário">
                &times;
            </button>

            <h2 id="titulo-modal-interesse">Tenho interesse neste veículo</h2>

            <p class="veiculo-escolhido-modal"></p>

            <form class="formulario-interesse">
                <label for="interesse-nome">Nome completo</label>
                <input id="interesse-nome"
                       name="nome"
                       type="text"
                       maxlength="255"
                       autocomplete="name"
                       placeholder="Digite seu nome"
                       required>

                <label for="interesse-email">E-mail</label>
                <input id="interesse-email"
                       name="email"
                       type="email"
                       maxlength="255"
                       autocomplete="email"
                       placeholder="seu@email.com"
                       required>

                <label for="interesse-telefone">Telefone</label>
                <input id="interesse-telefone"
                       name="telefone"
                       type="tel"
                       maxlength="30"
                       autocomplete="tel"
                       placeholder="(54) 99999-9999"
                       required>

                <label for="interesse-texto">Mensagem</label>
                <textarea id="interesse-texto"
                          name="texto"
                          rows="4"
                          maxlength="2000"
                          placeholder="Olá, gostaria de saber mais sobre este veículo."
                          required></textarea>

                <p class="mensagem-formulario-interesse"
                   role="status"
                   aria-live="polite"></p>

                <button type="submit" class="botao-enviar-interesse">
                    Enviar mensagem
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modalInteresse);

    formularioInteresse = modalInteresse.querySelector(
        ".formulario-interesse"
    );

    mensagemFormulario = modalInteresse.querySelector(
        ".mensagem-formulario-interesse"
    );

    botaoEnviarFormulario = modalInteresse.querySelector(
        ".botao-enviar-interesse"
    );

    const botaoFechar = modalInteresse.querySelector(
        ".fechar-modal-interesse"
    );

    botaoFechar.addEventListener("click", fecharFormularioInteresse);

    modalInteresse.addEventListener("click", evento => {
        if (evento.target === modalInteresse) {
            fecharFormularioInteresse();
        }
    });

    document.addEventListener("keydown", evento => {
        if (
            evento.key === "Escape" &&
            modalInteresse.classList.contains("ativo")
        ) {
            fecharFormularioInteresse();
        }
    });

    formularioInteresse.addEventListener("submit", enviarMensagemInteresse);
}

function abrirFormularioInteresse(veiculo) {
    criarModalInteresse();

    veiculoSelecionado = veiculo;

    const nomeVeiculo =
        `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""}`.trim();

    const resumoVeiculo = modalInteresse.querySelector(
        ".veiculo-escolhido-modal"
    );

    resumoVeiculo.textContent =
        `${nomeVeiculo} — ${veiculo.ano ?? "Ano não informado"} — ` +
        formatarPreco(veiculo.preco);

    formularioInteresse.reset();
    mensagemFormulario.textContent = "";
    mensagemFormulario.className = "mensagem-formulario-interesse";

    botaoEnviarFormulario.disabled = false;
    botaoEnviarFormulario.textContent = "Enviar mensagem";

    modalInteresse.classList.add("ativo");
    modalInteresse.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-interesse-aberto");

    modalInteresse.querySelector("#interesse-nome").focus();
}

function fecharFormularioInteresse() {
    if (!modalInteresse) {
        return;
    }

    modalInteresse.classList.remove("ativo");
    modalInteresse.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-interesse-aberto");

    veiculoSelecionado = null;
}

async function enviarMensagemInteresse(evento) {
    evento.preventDefault();

    if (!veiculoSelecionado || veiculoSelecionado.id == null) {
        mensagemFormulario.textContent =
            "Não foi possível identificar o veículo. Feche a janela e tente novamente.";
        return;
    }

    const dados = new FormData(formularioInteresse);

    const mensagem = {
        nome: dados.get("nome").trim(),
        email: dados.get("email").trim(),
        telefone: dados.get("telefone").trim(),
        texto: dados.get("texto").trim(),
        veiculo: {
            id: veiculoSelecionado.id
        }
    };

    botaoEnviarFormulario.disabled = true;
    botaoEnviarFormulario.textContent = "Enviando...";
    mensagemFormulario.textContent = "";

    try {
        const resposta = await fetch("/mensagens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mensagem)
        });

        if (!resposta.ok) {
            let detalhe = "";

            try {
                const erro = await resposta.json();
                detalhe = erro.message || erro.detail || "";
            } catch {
                // A resposta pode não conter JSON.
            }

            throw new Error(
                detalhe ||
                `Não foi possível enviar a mensagem (HTTP ${resposta.status}).`
            );
        }

        mensagemFormulario.textContent =
            "Mensagem enviada com sucesso! Nossa equipe entrará em contato.";

        mensagemFormulario.classList.add("sucesso");

        formularioInteresse.reset();
        botaoEnviarFormulario.textContent = "Mensagem enviada";

        setTimeout(() => {
            fecharFormularioInteresse();
        }, 2500);

    } catch (erro) {
        console.error("Erro ao enviar mensagem:", erro);

        mensagemFormulario.textContent =
            erro.message ||
            "Não foi possível enviar sua mensagem. Tente novamente.";

        mensagemFormulario.classList.add("erro");

        botaoEnviarFormulario.disabled = false;
        botaoEnviarFormulario.textContent = "Tentar novamente";
    }
}

async function carregarVeiculos() {
    if (!listaVeiculos || !estadoCatalogo) {
        console.error("Os elementos do catálogo não foram encontrados.");
        return;
    }

    estadoCatalogo.textContent = "Carregando veículos...";
    listaVeiculos.replaceChildren();

    try {
        const resposta = await fetch("/veiculos");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os veículos.");
        }

        const veiculos = await resposta.json();

        if (!Array.isArray(veiculos) || veiculos.length === 0) {
            estadoCatalogo.textContent =
                "No momento, não temos veículos disponíveis.";
            return;
        }

        const veiculosComImagens = await Promise.all(
            veiculos.map(async veiculo => ({
                veiculo,
                imagens: await buscarImagensDoVeiculo(veiculo.id)
            }))
        );

        veiculosComImagens.forEach(({ veiculo, imagens }) => {
            listaVeiculos.appendChild(
                criarCartaoVeiculo(veiculo, imagens)
            );
        });

        estadoCatalogo.textContent =
            `${veiculos.length} veículo(s) disponível(is).`;

    } catch (erro) {
        console.error("Erro ao carregar veículos:", erro);

        estadoCatalogo.textContent =
            "Não foi possível carregar os veículos. Tente novamente mais tarde.";
    }
}

carregarVeiculos();
