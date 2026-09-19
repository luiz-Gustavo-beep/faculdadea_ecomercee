package ribeiro_automoveis.com.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import ribeiro_automoveis.com.site.model.Opcional;

@Repository
public interface OpcionalRepository extends JpaRepository<Opcional, Long> {
    
}
