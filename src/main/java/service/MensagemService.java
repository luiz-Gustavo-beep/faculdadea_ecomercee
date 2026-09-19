package service;

import org.springframework.stereotype.Service;

import ribeiro_automoveis.com.site.model.Mensagem;

import ribeiro_automoveis.com.site.repository.MensagemRepository;

@Service
public class MensagemService {
    
    private final MensagemRepository mensagemRepository;

    public MensagemService(MensagemRepository mensagemRepository) {
        this.mensagemRepository = mensagemRepository;
    }

    public Mensagem salvarMensagem(Mensagem mensagem) {
        return mensagemRepository.save(mensagem);
    }

    public void excluirMensagem(Long id) {
        mensagemRepository.deleteById(id);
    }

    public Mensagem buscarMensagemPorId(Long id) {
        return mensagemRepository.findById(id).orElse(null);
    }

    public Iterable<Mensagem> listarMensagens() {
        return mensagemRepository.findAll();
    }
}
