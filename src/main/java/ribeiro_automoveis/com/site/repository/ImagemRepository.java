
package ribeiro_automoveis.com.site.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ribeiro_automoveis.com.site.model.Imagem;

@Repository
public interface ImagemRepository extends JpaRepository<Imagem, Long> {

    boolean existsByVeiculo_Id(Long veiculoId);

    List<Imagem> findByVeiculo_Id(Long veiculoId);

}
