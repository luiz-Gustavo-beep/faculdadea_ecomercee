const listaVeiculos = document.getElementById("lista-veiculos");
const estadoCatalogo = document.getElementById("estado-catalogo");

const LIMITE_FOTOS = 6;

// Busca as imagens de um veículo específico.
async function buscarImagensDoVeiculo(veiculoId) {
    try {
        const resposta = await fetch(`/imagens/veiculo/${veiculoId}`);

        if (!resposta.ok) {
            console.error(
                `Não foi possível buscar as fotos do veículo ${veiculoId}.`
            );
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
        console.error(
            `Erro ao buscar fotos do veículo ${veiculoId}:`,
            erro
        );

        return [];
    }
}

// Cria um botão de navegação do carrossel.
function criarBotaoCarrossel(texto, descricao, classe, acao) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = texto;
    botao.className = `seta-carrossel ${classe}`;
    botao.setAttribute("aria-label", descricao);

    botao.addEventListener("click", acao);

    return botao;
}

// Cria a área de fotos de um veículo.
function criarCarrossel(veiculo, imagens) {
    const areaImagem = document.createElement("div");
    areaImagem.className = "imagem-veiculo";

    if (imagens.length === 0) {
        areaImagem.textContent = "Foto do veículo indisponível";
        return areaImagem;
    }

    let indiceAtual = 0;

    const foto = document.createElement("img");
    foto.alt = `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""}`.trim();
    foto.loading = "lazy";

    areaImagem.appendChild(foto);

    // Atualiza a foto e o contador.
    function atualizarCarrossel() {
        foto.src = imagens[indiceAtual].url;

        foto.alt =
            `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""} - ` +
            `Foto ${indiceAtual + 1} de ${imagens.length}`;

        if (contador) {
            contador.textContent =
                `${indiceAtual + 1} / ${imagens.length}`;
        }
    }

    foto.addEventListener("error", () => {
        foto.alt = "Não foi possível carregar esta foto";
    });

    let contador = null;

    // As setas e o contador só aparecem quando há várias fotos.
    if (imagens.length > 1) {
        const anterior = criarBotaoCarrossel(
            "‹",
            "Ver foto anterior",
            "anterior",
            () => {
                indiceAtual =
                    (indiceAtual - 1 + imagens.length) % imagens.length;

                atualizarCarrossel();
            }
        );

        const proxima = criarBotaoCarrossel(
            "›",
            "Ver próxima foto",
            "proxima",
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

// Cria o cartão completo de um veículo.
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

    preco.textContent =
        veiculo.preco !== null && veiculo.preco !== undefined
            ? Number(veiculo.preco).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
            : "Consulte o preço";

    const descricao = document.createElement("p");
    descricao.className = "descricao-veiculo";
    descricao.textContent = veiculo.descricao ?? "";

    const botao = document.createElement("a");
    botao.href = "index.html#contato";
    botao.className = "botao-veiculo";
    botao.textContent = "Tenho interesse";

    informacoes.append(titulo, ano, preco, descricao, botao);
    cartao.append(areaImagem, informacoes);

    return cartao;
}

// Carrega os veículos e suas imagens.
async function carregarVeiculos() {
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
            veiculos.map(async veiculo => {
                const imagens = await buscarImagensDoVeiculo(veiculo.id);

                return { veiculo, imagens };
            })
        );

        veiculosComImagens.forEach(({ veiculo, imagens }) => {
            const cartao = criarCartaoVeiculo(veiculo, imagens);
            listaVeiculos.appendChild(cartao);
        });

        estadoCatalogo.textContent =
            `${veiculos.length} veículo(s) disponível(is).`;

    } catch (erro) {
        console.error("Erro ao carregar catálogo:", erro);

        estadoCatalogo.textContent =
            "Não foi possível carregar os veículos. " +
            "Tente novamente mais tarde.";
    }
}

carregarVeiculos();
