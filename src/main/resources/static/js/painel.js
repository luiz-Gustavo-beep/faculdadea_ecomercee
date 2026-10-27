
const listaVeiculos = document.getElementById("lista-veiculos");
const estadoVeiculos = document.getElementById("estado-veiculos");
const botaoAtualizar = document.getElementById("btn-atualizar");

const formularioVeiculo = document.getElementById("form-veiculo");
const estadoCadastro = document.getElementById("estado-cadastro");
const botaoCadastrar = document.getElementById("btn-cadastrar");
const botaoCancelarEdicao = document.getElementById("btn-cancelar-edicao");

const tituloFormulario = document.getElementById("titulo-formulario");
const descricaoFormulario = document.getElementById("descricao-formulario");

const campoFoto = document.getElementById("foto");
const ajudaFoto = document.getElementById("ajuda-foto");
const previaFoto = document.getElementById("previa-foto");

const TAMANHO_MAXIMO = 5 * 1024 * 1024;
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

let fotosSelecionadas = [];
let veiculoEmEdicao = null;

// ========================================
// SELEÇÃO ACUMULATIVA DE FOTOS
// ========================================

campoFoto.addEventListener("change", function () {
    estadoCadastro.textContent = "";

    const novosArquivos = Array.from(campoFoto.files);

    for (const arquivo of novosArquivos) {
        if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
            campoFoto.value = "";
            estadoCadastro.textContent =
                `A imagem "${arquivo.name}" tem formato inválido. Use JPG, PNG ou WEBP.`;
            return;
        }

        if (arquivo.size > TAMANHO_MAXIMO) {
            campoFoto.value = "";
            estadoCadastro.textContent =
                `A imagem "${arquivo.name}" ultrapassa o limite de 5 MB.`;
            return;
        }
    }

    for (const arquivo of novosArquivos) {
        const jaAdicionado = fotosSelecionadas.some(item =>
            item.name === arquivo.name &&
            item.size === arquivo.size &&
            item.lastModified === arquivo.lastModified
        );

        if (!jaAdicionado) {
            fotosSelecionadas.push(arquivo);
        }
    }

    campoFoto.value = "";

    renderizarPreviaFotos();

    estadoCadastro.textContent = fotosSelecionadas.length
        ? `${fotosSelecionadas.length} foto(s) selecionada(s). Você pode adicionar mais.`
        : "";
});

function renderizarPreviaFotos() {
    previaFoto.replaceChildren();

    fotosSelecionadas.forEach((arquivo, indice) => {
        const recipiente = document.createElement("div");

        recipiente.style.display = "inline-flex";
        recipiente.style.flexDirection = "column";
        recipiente.style.alignItems = "center";
        recipiente.style.verticalAlign = "top";
        recipiente.style.margin = "0 10px 10px 0";
        recipiente.style.gap = "5px";

        const imagem = document.createElement("img");
        const urlTemporaria = URL.createObjectURL(arquivo);

        imagem.src = urlTemporaria;
        imagem.alt = `Prévia: ${arquivo.name}`;
        imagem.title = arquivo.name;
        imagem.style.width = "160px";
        imagem.style.height = "120px";
        imagem.style.objectFit = "cover";
        imagem.style.borderRadius = "8px";

        imagem.addEventListener("load", () => {
            URL.revokeObjectURL(urlTemporaria);
        }, { once: true });

        const nome = document.createElement("span");

        nome.textContent = arquivo.name;
        nome.style.maxWidth = "160px";
        nome.style.overflowWrap = "anywhere";
        nome.style.fontSize = "12px";

        const botaoRemover = document.createElement("button");

        botaoRemover.type = "button";
        botaoRemover.textContent = "Remover";

        botaoRemover.addEventListener("click", () => {
            fotosSelecionadas.splice(indice, 1);
            renderizarPreviaFotos();

            estadoCadastro.textContent = fotosSelecionadas.length
                ? `${fotosSelecionadas.length} foto(s) selecionada(s).`
                : "Nenhuma foto selecionada.";
        });

        recipiente.append(imagem, nome, botaoRemover);
        previaFoto.appendChild(recipiente);
    });
}

// ========================================
// CARREGAR VEÍCULOS
// ========================================

async function carregarVeiculos() {
    estadoVeiculos.textContent = "Carregando veículos...";
    listaVeiculos.replaceChildren();

    try {
        const resposta = await fetch("/veiculos");

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível consultar os veículos (${resposta.status}).`
            );
        }

        const veiculos = await resposta.json();

        if (!Array.isArray(veiculos) || veiculos.length === 0) {
            estadoVeiculos.textContent =
                "Nenhum veículo disponível encontrado.";
            return;
        }

        veiculos.forEach(veiculo => {
            const linha = document.createElement("tr");

            const valores = [
                veiculo.id,
                `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""}`.trim(),
                veiculo.ano,
                formatarPreco(veiculo.preco),
                veiculo.situacao
            ];

            valores.forEach(valor => {
                const celula = document.createElement("td");
                celula.textContent = valor ?? "-";
                linha.appendChild(celula);
            });

            const celulaAcoes = document.createElement("td");
            const botaoEditar = document.createElement("button");

            botaoEditar.type = "button";
            botaoEditar.className = "botao-atualizar";
            botaoEditar.textContent = "Editar";

            botaoEditar.addEventListener("click", () => {
                iniciarEdicao(veiculo);
            });

            celulaAcoes.appendChild(botaoEditar);
            linha.appendChild(celulaAcoes);
            listaVeiculos.appendChild(linha);
        });

        estadoVeiculos.textContent =
            `${veiculos.length} veículo(s) encontrado(s).`;

    } catch (erro) {
        console.error("Erro ao carregar veículos:", erro);
        estadoVeiculos.textContent =
            "Não foi possível carregar os veículos. Verifique o servidor e o acesso à API.";
    }
}

function formatarPreco(preco) {
    if (preco === null || preco === undefined) {
        return "Não informado";
    }

    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ========================================
// FORMATAR DATA E HORA DA MENSAGEM
// ========================================

function formatarData(data) {
    if (!data) {
        return "Não informada";
    }

    const dataEnvio = new Date(data);

    if (Number.isNaN(dataEnvio.getTime())) {
        return String(data);
    }

    return dataEnvio.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ========================================
// EDITAR VEÍCULO
// ========================================

function iniciarEdicao(veiculo) {
    veiculoEmEdicao = veiculo.id;

    document.getElementById("marca").value = veiculo.marca ?? "";
    document.getElementById("modelo").value = veiculo.modelo ?? "";
    document.getElementById("ano").value = veiculo.ano ?? "";
    document.getElementById("preco").value = veiculo.preco ?? "";
    document.getElementById("descricao").value = veiculo.descricao ?? "";

    const situacao = document.getElementById("situacao");

    const situacoesValidas = Array.from(situacao.options)
        .some(opcao => opcao.value === veiculo.situacao);

    situacao.value = situacoesValidas
        ? veiculo.situacao
        : "disponível";

    tituloFormulario.textContent = `Editando veículo #${veiculo.id}`;
    descricaoFormulario.textContent =
        "Altere os dados desejados e salve as modificações.";

    botaoCadastrar.textContent = "Salvar alterações";
    botaoCancelarEdicao.hidden = false;

    fotosSelecionadas = [];
    campoFoto.value = "";
    campoFoto.disabled = false;

    ajudaFoto.textContent =
        "Opcional. Você pode selecionar fotos agora e adicionar outras depois. As fotos atuais não serão removidas.";

    renderizarPreviaFotos();

    estadoCadastro.textContent =
        `Veículo ${veiculo.marca} ${veiculo.modelo} selecionado para edição.`;

    document.getElementById("veiculos").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function cancelarEdicao() {
    veiculoEmEdicao = null;
    formularioVeiculo.reset();
    fotosSelecionadas = [];

    campoFoto.disabled = false;

    ajudaFoto.textContent =
        "Opcional. Selecione fotos em uma ou mais etapas. Tamanho máximo: 5 MB por foto.";

    renderizarPreviaFotos();

    tituloFormulario.textContent = "Cadastrar veículo";
    descricaoFormulario.textContent =
        "Preencha os dados para adicionar um veículo.";

    botaoCadastrar.textContent = "Cadastrar veículo";
    botaoCancelarEdicao.hidden = true;
    estadoCadastro.textContent = "";
}

// ========================================
// ENVIAR FOTOS PARA O BACKEND
// ========================================

async function enviarFotos(veiculoId, arquivos) {
    for (const arquivo of arquivos) {
        estadoCadastro.textContent = `Enviando foto "${arquivo.name}"...`;

        const formularioImagem = new FormData();
        formularioImagem.append("arquivo", arquivo);

        const respostaImagem = await fetch(
            `/imagens/upload/${veiculoId}`,
            {
                method: "POST",
                body: formularioImagem
            }
        );

        if (!respostaImagem.ok) {
            const detalheImagem = await respostaImagem.text();

            throw new Error(
                `O veículo foi salvo, mas a foto "${arquivo.name}" não foi salva (${respostaImagem.status}): ${detalheImagem}`
            );
        }
    }
}

// ========================================
// CADASTRAR OU ATUALIZAR VEÍCULO
// ========================================

botaoCancelarEdicao.addEventListener("click", cancelarEdicao);

formularioVeiculo.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    estadoCadastro.textContent = veiculoEmEdicao !== null
        ? "Salvando alterações..."
        : "Cadastrando veículo...";

    botaoCadastrar.disabled = true;
    botaoCancelarEdicao.disabled = true;

    const arquivos = [...fotosSelecionadas];

    try {
        for (const arquivo of arquivos) {
            if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
                throw new Error(
                    `Formato inválido na imagem "${arquivo.name}". Use JPG, PNG ou WEBP.`
                );
            }

            if (arquivo.size > TAMANHO_MAXIMO) {
                throw new Error(
                    `A imagem "${arquivo.name}" deve ter no máximo 5 MB.`
                );
            }
        }

        const dadosVeiculo = {
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value.trim(),
            ano: Number(document.getElementById("ano").value),
            preco: Number(document.getElementById("preco").value),
            descricao: document.getElementById("descricao").value.trim(),
            situacao: document.getElementById("situacao").value,
            administrador: {
                id: 3
            }
        };

        if (veiculoEmEdicao !== null) {
            const id = veiculoEmEdicao;

            const resposta = await fetch(`/veiculos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosVeiculo)
            });

            if (!resposta.ok) {
                const detalhe = await resposta.text();

                throw new Error(
                    `Erro ao atualizar o veículo (${resposta.status}): ${detalhe}`
                );
            }

            if (arquivos.length > 0) {
                await enviarFotos(id, arquivos);
            }

            cancelarEdicao();

            estadoCadastro.textContent = arquivos.length > 0
                ? `Veículo atualizado e ${arquivos.length} nova(s) foto(s) adicionada(s) com sucesso!`
                : "Veículo atualizado com sucesso!";

            await carregarVeiculos();

        } else {
            const resposta = await fetch("/veiculos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosVeiculo)
            });

            if (!resposta.ok) {
                const detalhe = await resposta.text();

                throw new Error(
                    `Erro ao cadastrar o veículo (${resposta.status}): ${detalhe}`
                );
            }

            const veiculoCriado = await resposta.json();

            if (arquivos.length > 0) {
                await enviarFotos(veiculoCriado.id, arquivos);
            }

            formularioVeiculo.reset();
            fotosSelecionadas = [];
            renderizarPreviaFotos();

            estadoCadastro.textContent = arquivos.length > 0
                ? `Veículo cadastrado e ${arquivos.length} foto(s) enviada(s) com sucesso!`
                : "Veículo cadastrado com sucesso! Você não selecionou fotos.";

            await carregarVeiculos();
        }

    } catch (erro) {
        console.error("Erro no formulário de veículos:", erro);

        estadoCadastro.textContent = erro.message ||
            "Não foi possível concluir a operação. Confira o console.";

    } finally {
        botaoCadastrar.disabled = false;
        botaoCancelarEdicao.disabled = false;
    }
});

// ========================================
// CARREGAR MENSAGENS RECEBIDAS
// ========================================

async function carregarMensagens() {
    const listaMensagens = document.getElementById("lista-mensagens");
    const estadoMensagens = document.getElementById("estado-mensagens");

    if (!listaMensagens || !estadoMensagens) {
        console.error("Elementos da tabela de mensagens não encontrados.");
        return;
    }

    estadoMensagens.textContent = "Carregando mensagens...";
    listaMensagens.replaceChildren();

    try {
        const resposta = await fetch("/mensagens");

        if (!resposta.ok) {
            throw new Error(
                `Erro ao buscar mensagens (${resposta.status}).`
            );
        }

        const mensagens = await resposta.json();

        if (!Array.isArray(mensagens) || mensagens.length === 0) {
            estadoMensagens.textContent = "Nenhuma mensagem recebida.";
            return;
        }

        mensagens.forEach(mensagem => {
            const linha = document.createElement("tr");

            const veiculo = mensagem.veiculo;
            const nomeVeiculo = veiculo
                ? `${veiculo.marca ?? ""} ${veiculo.modelo ?? ""}`.trim()
                : "Veículo não informado";

            const valores = [
                mensagem.nome,
                mensagem.email,
                mensagem.telefone,
                nomeVeiculo,
                mensagem.texto,
                formatarData(mensagem.dataEnvio)
            ];

            valores.forEach(valor => {
                const celula = document.createElement("td");
                celula.textContent = valor ?? "-";
                linha.appendChild(celula);
            });

            listaMensagens.appendChild(linha);
        });

        estadoMensagens.textContent =
            `${mensagens.length} mensagem(ns) recebida(s).`;

    } catch (erro) {
        console.error("Erro ao carregar mensagens:", erro);

        estadoMensagens.textContent =
            "Não foi possível carregar as mensagens. Verifique o servidor.";
    }
}

// ========================================
// BOTÕES E INICIALIZAÇÃO
// ========================================

if (botaoAtualizar) {
    botaoAtualizar.addEventListener("click", carregarVeiculos);
}

carregarVeiculos();
carregarMensagens();
