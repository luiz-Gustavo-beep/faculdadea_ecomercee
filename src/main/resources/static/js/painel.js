
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

let veiculoEmEdicao = null;

campoFoto.addEventListener("change", function () {
    previaFoto.replaceChildren();
    estadoCadastro.textContent = "";

    const arquivos = Array.from(campoFoto.files);

    for (const arquivo of arquivos) {
        if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
            campoFoto.value = "";
            estadoCadastro.textContent =
                "Formato inválido. Selecione apenas JPG, PNG ou WEBP.";
            return;
        }

        if (arquivo.size > TAMANHO_MAXIMO) {
            campoFoto.value = "";
            estadoCadastro.textContent =
                `A imagem "${arquivo.name}" ultrapassa o limite de 5 MB.`;
            return;
        }
    }

    arquivos.forEach(arquivo => {
        const imagem = document.createElement("img");
        const urlTemporaria = URL.createObjectURL(arquivo);

        imagem.src = urlTemporaria;
        imagem.alt = `Prévia: ${arquivo.name}`;
        imagem.style.maxWidth = "160px";
        imagem.style.maxHeight = "120px";
        imagem.style.objectFit = "cover";
        imagem.style.borderRadius = "8px";
        imagem.style.marginRight = "8px";
        imagem.style.marginBottom = "8px";

        imagem.addEventListener("load", () => {
            URL.revokeObjectURL(urlTemporaria);
        });

        previaFoto.appendChild(imagem);
    });

    estadoCadastro.textContent = arquivos.length
        ? `${arquivos.length} foto(s) selecionada(s).`
        : "";
});

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

    campoFoto.value = "";
    campoFoto.disabled = false;
    ajudaFoto.textContent =
        "Opcional. Selecione novas fotos para adicionar sem remover as atuais. Máximo de 5 MB por foto.";
    previaFoto.replaceChildren();

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

    campoFoto.disabled = false;
    ajudaFoto.textContent =
        "Opcional. Selecione uma ou mais fotos. Tamanho máximo: 5 MB por foto.";

    previaFoto.replaceChildren();

    tituloFormulario.textContent = "Cadastrar veículo";
    descricaoFormulario.textContent =
        "Preencha os dados para adicionar um veículo.";

    botaoCadastrar.textContent = "Cadastrar veículo";
    botaoCancelarEdicao.hidden = true;
    estadoCadastro.textContent = "";
}

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

botaoCancelarEdicao.addEventListener("click", cancelarEdicao);

formularioVeiculo.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    estadoCadastro.textContent = veiculoEmEdicao !== null
        ? "Salvando alterações..."
        : "Cadastrando veículo...";

    botaoCadastrar.disabled = true;
    botaoCancelarEdicao.disabled = true;

    const arquivos = Array.from(campoFoto.files);

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
                ? "Veículo atualizado e novas fotos adicionadas com sucesso!"
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
                    `Erro ao cadastrar veículo (${resposta.status}): ${detalhe}`
                );
            }

            const veiculoCriado = await resposta.json();

            if (arquivos.length > 0) {
                await enviarFotos(veiculoCriado.id, arquivos);
                estadoCadastro.textContent =
                    `Veículo cadastrado e ${arquivos.length} foto(s) enviada(s) com sucesso!`;
            } else {
                estadoCadastro.textContent =
                    "Veículo cadastrado com sucesso! Você não selecionou fotos.";
            }

            formularioVeiculo.reset();
            previaFoto.replaceChildren();

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

if (botaoAtualizar) {
    botaoAtualizar.addEventListener("click", carregarVeiculos);
}

carregarVeiculos();
