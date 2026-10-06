package ribeiro_automoveis.com.site;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import service.AdministradorDetailsService;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> {})
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/veiculos/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/veiculos/**").authenticated()
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
      BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
      System.out.println("HASH DA SENHA 123456: " + encoder.encode("123456"));

      return encoder;
    }
    
    @Autowired
    public void configurarAutenticacao(
        AuthenticationManagerBuilder auth,
        AdministradorDetailsService administradorDetailsService) throws Exception {

      auth.userDetailsService(administradorDetailsService);
    }

}