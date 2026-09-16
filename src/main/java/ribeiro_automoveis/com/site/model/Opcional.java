package ribeiro_automoveis.com.site.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Opcional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean arCondicionado;
    private boolean cambioAutomatico;
    private boolean bancoCouro;
    private boolean vidroEletrico;
    private boolean multimidia;
    private boolean flex;
    private boolean direcao;

    @ManyToOne
    private Veiculo veiculo;

    public Opcional() {
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isArCondicionado() {
        return arCondicionado;
    }

    public void setArCondicionado(boolean arCondicionado) {
        this.arCondicionado = arCondicionado;
    }

    public boolean isCambioAutomatico() {
        return cambioAutomatico;
    }

    public void setCambioAutomatico(boolean cambioAutomatico) {
        this.cambioAutomatico = cambioAutomatico;
    }

    public boolean isBancoCouro() {
        return bancoCouro;
    }

    public void setBancoCouro(boolean bancoCouro) {
        this.bancoCouro = bancoCouro;
    }

    public boolean isVidroEletrico() {
        return vidroEletrico;
    }

    public void setVidroEletrico(boolean vidroEletrico) {
        this.vidroEletrico = vidroEletrico;
    }

    public boolean isMultimidia() {
        return multimidia;
    }

    public void setMultimidia(boolean multimidia) {
        this.multimidia = multimidia;
    }

    public boolean isFlex() {
        return flex;
    }

    public void setFlex(boolean flex) {
        this.flex = flex;
    }

    public boolean isDirecao() {
        return direcao;
    }

    public void setDirecao(boolean direcao) {
        this.direcao = direcao;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
}