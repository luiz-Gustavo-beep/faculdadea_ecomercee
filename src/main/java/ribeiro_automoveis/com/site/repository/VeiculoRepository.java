
package ribeiro_automoveis.com.site.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ribeiro_automoveis.com.site.model.Veiculo;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    List<Veiculo> findBySituacao(String situacao);

    List<Veiculo> findByMarcaContainingIgnoreCaseAndSituacao(
            String marca, String situacao);

    List<Veiculo> findByModeloContainingIgnoreCaseAndSituacao(
            String modelo, String situacao);

    List<Veiculo> findByMarcaContainingIgnoreCaseAndModeloContainingIgnoreCaseAndSituacao(
            String marca, String modelo, String situacao);
}
