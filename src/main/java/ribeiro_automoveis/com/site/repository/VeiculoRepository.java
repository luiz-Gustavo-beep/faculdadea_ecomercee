package ribeiro_automoveis.com.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import ribeiro_automoveis.com.site.model.Veiculo;

import java.util.List;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    
        List<Veiculo> findBySituacao(String situacao);
    
}
