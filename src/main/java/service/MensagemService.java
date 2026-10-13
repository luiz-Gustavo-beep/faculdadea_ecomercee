
package service;

import java.time.LocalDateTime;

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
        if (mensagem.getDataEnvio() == null) {
            mensagem.setDataEnvio(LocalDateTime.now());
        }

        return mensagemRepository.save(mensagem);
    }

    public Mensagem marcarComoLida(Long id) {
        Mensagem mensagem = mensagemRepository.findById(id).orElse(null);

        if (mensagem == null) {
            return null;
        }

        mensagem.setLida(true);

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
