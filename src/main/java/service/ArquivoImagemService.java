
package service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ArquivoImagemService {

    private final Path pastaImagens =
            Paths.get("uploads", "veiculos").toAbsolutePath().normalize();

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    public String salvarArquivo(MultipartFile arquivo) throws IOException {

        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Selecione uma imagem.");
        }

        if (arquivo.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "A imagem deve ter no máximo 5 MB.");
        }

        if (!TIPOS_PERMITIDOS.contains(arquivo.getContentType())) {
            throw new IllegalArgumentException(
                    "Formato inválido. Use JPG, PNG ou WEBP.");
        }

        Files.createDirectories(pastaImagens);

        String tipo = arquivo.getContentType();
        String extensao = switch (tipo) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new IllegalArgumentException(
                    "Formato de imagem não permitido.");
        };

        String nomeArquivo = UUID.randomUUID() + extensao;
        Path destino = pastaImagens.resolve(nomeArquivo).normalize();

        if (!destino.startsWith(pastaImagens)) {
            throw new IllegalArgumentException("Caminho de arquivo inválido.");
        }

        Files.copy(
                arquivo.getInputStream(),
                destino,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/veiculos/" + nomeArquivo;
    }
}
