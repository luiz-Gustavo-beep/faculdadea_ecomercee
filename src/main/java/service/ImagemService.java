package service;

import org.springframework.stereotype.Service;

import ribeiro_automoveis.com.site.model.Imagem;

import ribeiro_automoveis.com.site.repository.ImagemRepository;

@Service 
public class ImagemService {
    private final ImagemRepository imagemRepository;

    public ImagemService(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    public Imagem salvarImagem(Imagem imagem) {
        return imagemRepository.save(imagem);
    }

    public void excluirImagem(Long id) {
        imagemRepository.deleteById(id);
    }

    public Imagem buscarImagemPorId(Long id) {
        return imagemRepository.findById(id).orElse(null);
    }

    public Iterable<Imagem> listarImagens() {
        return imagemRepository.findAll();
    }

}
