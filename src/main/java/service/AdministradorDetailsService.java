package service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ribeiro_automoveis.com.site.repository.AdministradorRepository;

@Service
public class AdministradorDetailsService implements UserDetailsService {

    private final AdministradorRepository administradorRepository;

    public AdministradorDetailsService(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usuario) throws UsernameNotFoundException {

        System.out.println(">>> LOGIN RECEBIDO: " + usuario);

        var administrador = administradorRepository.findByUsuario(usuario)
                .orElseThrow(() -> new UsernameNotFoundException("Administrador não encontrado"));

        System.out.println(">>> USUARIO ENCONTRADO: " + administrador.getUsuario());

        return User.withUsername(administrador.getUsuario())
                .password(administrador.getSenha())
                .roles("ADMIN")
                .build();
    }
}