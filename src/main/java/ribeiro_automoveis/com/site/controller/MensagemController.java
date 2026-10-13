
package ribeiro_automoveis.com.site.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ribeiro_automoveis.com.site.model.Mensagem;
import service.MensagemService;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {

    @Autowired
    public MensagemService mensagemService;

    @GetMapping
    public Iterable<Mensagem> listarMensagens() {
        return mensagemService.listarMensagens();
    }

    @GetMapping("/{id}")
    public Mensagem buscarMensagemPorId(@PathVariable Long id) {
        return mensagemService.buscarMensagemPorId(id);
    }

    @PostMapping
    public Mensagem salvarMensagem(@Valid @RequestBody Mensagem mensagem) {
        return mensagemService.salvarMensagem(mensagem);
    }

    @PutMapping("/{id}")
    public Mensagem atualizarMensagem(
            @PathVariable Long id,
            @Valid @RequestBody Mensagem mensagem) {
        mensagem.setId(id);
        return mensagemService.salvarMensagem(mensagem);
    }

    @PutMapping("/{id}/lida")
    public Mensagem marcarComoLida(@PathVariable Long id) {
        return mensagemService.marcarComoLida(id);
    }

    @DeleteMapping("/{id}")
    public void excluirMensagem(@PathVariable Long id) {
        mensagemService.excluirMensagem(id);
    }
}
