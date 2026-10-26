package ribeiro_automoveis.com.site.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import ribeiro_automoveis.com.site.model.Imagem;
import ribeiro_automoveis.com.site.model.Veiculo;
import ribeiro_automoveis.com.site.repository.VeiculoRepository;
import service.ArquivoImagemService;
import service.ImagemService;

@RestController
@RequestMapping("/imagens")
public class ImagemController {

    private final ImagemService imagemService;
    private final ArquivoImagemService arquivoImagemService;
    private final VeiculoRepository veiculoRepository;

    public ImagemController(
            ImagemService imagemService,
            ArquivoImagemService arquivoImagemService,
            VeiculoRepository veiculoRepository) {
        this.imagemService = imagemService;
        this.arquivoImagemService = arquivoImagemService;
        this.veiculoRepository = veiculoRepository;
    }

    @GetMapping
    public Iterable<Imagem> listarImagens() {
        return imagemService.listarImagens();
    }

    @GetMapping("/{id}")
    public Imagem buscarImagemPorId(@PathVariable Long id) {
        return imagemService.buscarImagemPorId(id);
    }

    @GetMapping("/veiculo/{veiculoId}")
    public List<Imagem> listarImagensPorVeiculo(
            @PathVariable Long veiculoId) {
        return imagemService.listarPorVeiculo(veiculoId);
    }

    @PostMapping
    public Imagem salvarImagem(@Valid @RequestBody Imagem imagem) {
        return imagemService.salvarImagem(imagem);
    }

    @PostMapping(
            value = "/upload/{veiculoId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Imagem enviarImagem(
            @PathVariable Long veiculoId,
            @RequestParam("arquivo") MultipartFile arquivo) {

        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Veículo não encontrado: " + veiculoId));

        try {
            String caminho = arquivoImagemService.salvarArquivo(arquivo);

            Imagem imagem = new Imagem();
            imagem.setUrl(caminho);
            imagem.setVeiculo(veiculo);

            return imagemService.salvarImagem(imagem);

        } catch (IllegalArgumentException erro) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    erro.getMessage());

        } catch (IOException erro) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Não foi possível salvar a imagem.");
        }
    }

    @PutMapping("/{id}")
    public Imagem atualizarImagem(
            @PathVariable Long id,
            @Valid @RequestBody Imagem imagem) {

        imagem.setId(id);
        return imagemService.salvarImagem(imagem);
    }

    @DeleteMapping("/{id}")
    public void excluirImagem(@PathVariable Long id) {
        imagemService.excluirImagem(id);
    }
}
