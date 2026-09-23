package service;

import org.springframework.stereotype.Service;

import ribeiro_automoveis.com.site.model.Veiculo;

import ribeiro_automoveis.com.site.repository.VeiculoRepository;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public Veiculo salvarVeiculo(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }

    public void excluirVeiculo(Long id) {
        veiculoRepository.deleteById(id);
    }

    public Veiculo buscarVeiculoPorId(Long id) {
        return veiculoRepository.findById(id).orElse(null);
    }

    public Iterable<Veiculo> listarVeiculos() {
        return veiculoRepository.findAll();
    }

    public Veiculo atualizarVeiculo(Long id, Veiculo veiculo) {
        veiculo.setId(id);
        return veiculoRepository.save(veiculo);
    }
}