package service;

import org.springframework.stereotype.Service;

import ribeiro_automoveis.com.site.model.Opcional;

import ribeiro_automoveis.com.site.repository.OpcionalRepository;

@Service 
public class OpcionalService {
    private final OpcionalRepository opcionalRepository;

    public OpcionalService(OpcionalRepository opcionalRepository) {
        this.opcionalRepository = opcionalRepository;
    }
    
    public Opcional salvarOpcional(Opcional opcional) {
        return opcionalRepository.save(opcional);
    }

    public void excluirOpcional(Long id) {
        opcionalRepository.deleteById(id);
    }

    public Opcional buscarOpcionalPorId(Long id) {
        return opcionalRepository.findById(id).orElse(null);
    }

    public Iterable<Opcional> listarOpcionais() {
        return opcionalRepository.findAll();
    }

}
