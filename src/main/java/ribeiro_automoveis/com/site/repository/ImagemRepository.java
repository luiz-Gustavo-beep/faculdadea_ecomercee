package ribeiro_automoveis.com.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import ribeiro_automoveis.com.site.model.Imagem;

@Repository
public interface ImagemRepository extends JpaRepository<Imagem, Long> {
    
}
