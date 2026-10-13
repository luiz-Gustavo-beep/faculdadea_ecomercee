
package service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ribeiro_automoveis.com.site.model.Veiculo;
import ribeiro_automoveis.com.site.repository.VeiculoRepository;
import ribeiro_automoveis.com.site.repository.ImagemRepository;
import ribeiro_automoveis.com.site.repository.MensagemRepository;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;
    private final ImagemRepository imagemRepository;
    private final MensagemRepository mensagemRepository;

    public VeiculoService(
            VeiculoRepository veiculoRepository,
            ImagemRepository imagemRepository,
            MensagemRepository mensagemRepository) {

        this.veiculoRepository = veiculoRepository;
        this.imagemRepository = imagemRepository;
        this.mensagemRepository = mensagemRepository;
    }

    public Veiculo salvarVeiculo(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }

    @Transactional
    public void excluirVeiculo(Long id) {

        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "Veículo não encontrado: " + id));

        boolean possuiImagens = imagemRepository.existsByVeiculo_Id(id);
        boolean possuiMensagens = mensagemRepository.existsByVeiculo_Id(id);

        if (possuiImagens || possuiMensagens) {
            veiculo.setSituacao("indisponível");
            veiculoRepository.save(veiculo);
        } else {
            veiculoRepository.delete(veiculo);
        }
    }

    public Veiculo buscarVeiculoPorId(Long id) {
        return veiculoRepository.findById(id).orElse(null);
    }

    public Iterable<Veiculo> listarVeiculos() {
        return veiculoRepository.findBySituacao("disponível");
    }

    public Veiculo atualizarVeiculo(Long id, Veiculo veiculo) {
        veiculo.setId(id);
        return veiculoRepository.save(veiculo);
    }

    public Iterable<Veiculo> buscarPorMarca(String marca) {
        return veiculoRepository
                .findByMarcaContainingIgnoreCaseAndSituacao(
                    marca, "disponível");
    }

    public Iterable<Veiculo> buscarPorModelo(String modelo) {
        return veiculoRepository
                .findByModeloContainingIgnoreCaseAndSituacao(
                    modelo, "disponível");
    }

    public Iterable<Veiculo> buscarPorMarcaEModelo(
            String marca, String modelo) {

        return veiculoRepository
                .findByMarcaContainingIgnoreCaseAndModeloContainingIgnoreCaseAndSituacao(
                    marca, modelo, "disponível");
    }
}
