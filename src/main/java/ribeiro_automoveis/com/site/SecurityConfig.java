package ribeiro_automoveis.com.site;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import service.AdministradorDetailsService;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> {})
            .authorizeHttpRequests(auth -> auth

                // Swagger público
                .requestMatchers(
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/swagger-ui.html"
                ).permitAll()

                // Visitantes podem consultar veículos
                .requestMatchers(HttpMethod.GET, "/veiculos", "/veiculos/**")
                .permitAll()

                // Visitantes podem enviar mensagens de interesse
                .requestMatchers(HttpMethod.POST, "/mensagens")
                .permitAll()

                // Consultar e administrar mensagens exige autenticação
                .requestMatchers("/mensagens", "/mensagens/**")
                .authenticated()

                // Consultas públicas de imagens e opcionais
                .requestMatchers(HttpMethod.GET, "/imagens", "/imagens/**")
                .permitAll()
                .requestMatchers(HttpMethod.GET, "/opcionais", "/opcionais/**")
                .permitAll()

                // Alterações de veículos exigem autenticação
                .requestMatchers(HttpMethod.POST, "/veiculos", "/veiculos/**")
                .authenticated()
                .requestMatchers(HttpMethod.PUT, "/veiculos", "/veiculos/**")
                .authenticated()
                .requestMatchers(HttpMethod.DELETE, "/veiculos", "/veiculos/**")
                .authenticated()

                // Alterações de imagens exigem autenticação
                .requestMatchers(HttpMethod.POST, "/imagens", "/imagens/**")
                .authenticated()
                .requestMatchers(HttpMethod.PUT, "/imagens", "/imagens/**")
                .authenticated()
                .requestMatchers(HttpMethod.DELETE, "/imagens", "/imagens/**")
                .authenticated()

                // Alterações de opcionais exigem autenticação
                .requestMatchers(HttpMethod.POST, "/opcionais", "/opcionais/**")
                .authenticated()
                .requestMatchers(HttpMethod.PUT, "/opcionais", "/opcionais/**")
                .authenticated()
                .requestMatchers(HttpMethod.DELETE, "/opcionais", "/opcionais/**")
                .authenticated()

                // Administração de contas exige autenticação
                .requestMatchers("/administradores", "/administradores/**")
                .authenticated()

                // Todas as outras rotas exigem autenticação
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public void configurarAutenticacao(
            AuthenticationManagerBuilder auth,
            AdministradorDetailsService administradorDetailsService
    ) throws Exception {

        auth.userDetailsService(administradorDetailsService);
    }
}