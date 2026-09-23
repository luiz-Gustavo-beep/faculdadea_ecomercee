package ribeiro_automoveis.com.site.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import ribeiro_automoveis.com.site.model.Imagem;

import service.ImagemService;

@RestController
@RequestMapping("/imagens")
public class ImagemController {


@Autowired
public ImagemService imagemService;

    @GetMapping
    public Iterable<Imagem> listarImagens() {
    return imagemService.listarImagens();
    }

    @GetMapping("/{id}")
    public Imagem buscarImagemPorId(@PathVariable Long id) {
        return imagemService.buscarImagemPorId(id);
    }

    @PostMapping
    public Imagem salvarImagem(@RequestBody Imagem imagem) {
        return imagemService.salvarImagem(imagem);
    }

    @PutMapping("/{id}")
    public Imagem atualizarImagem(@PathVariable Long id, @RequestBody Imagem imagem) {
        imagem.setId(id);
        return imagemService.salvarImagem(imagem);
    }

    @DeleteMapping("/{id}")
    public void excluirImagem(@PathVariable Long id) {
        imagemService.excluirImagem(id);
    }

}
