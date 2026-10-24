package ribeiro_automoveis.com.site.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
public class Imagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "A URL da imagem é obrigatória")
    @Pattern(
        regexp = "(https?://.+|/uploads/veiculos/[A-Za-z0-9-]+\\.(jpg|png|webp))",
        message = "Informe uma URL válida ou o caminho de uma imagem armazenada"
    )
    private String url;

    @NotNull(message = "O veículo é obrigatório")
    @ManyToOne
    private Veiculo veiculo;

    public Imagem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
}
