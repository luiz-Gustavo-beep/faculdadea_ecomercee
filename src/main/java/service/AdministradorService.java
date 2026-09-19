package service;

import org.springframework.stereotype.Service;

import ribeiro_automoveis.com.site.model.Administrador;

import ribeiro_automoveis.com.site.repository.AdministradorRepository;


@Service    
public class AdministradorService {
    
    private final AdministradorRepository administradorRepository;

    public AdministradorService(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    public Administrador salvarAdministrador(Administrador administrador) {
        return administradorRepository.save(administrador);
    }

    public void excluirAdministrador(Long id) {
        administradorRepository.deleteById(id);
    }

    public Administrador buscarAdministradorPorId(Long id) {
        return administradorRepository.findById(id).orElse(null);
    }

    public Iterable<Administrador> listarAdministradores() {
        return administradorRepository.findAll();
    }
}