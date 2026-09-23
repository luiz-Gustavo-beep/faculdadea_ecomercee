package ribeiro_automoveis.com.site.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import ribeiro_automoveis.com.site.model.Administrador;

import service.AdministradorService;

@RestController
@RequestMapping("/administradores")

public class AdministradorController {
 
    @Autowired 
    public AdministradorService administradorService;

    @GetMapping
    public Iterable<Administrador> listarAdministradores() {
        return administradorService.listarAdministradores(); 
    }   

    @GetMapping("/{id}")
    public Administrador buscarAdministradorPorId(@PathVariable Long id) {
        return administradorService.buscarAdministradorPorId(id);
    }

    @PostMapping
    public Administrador salvarAdministrador(@RequestBody Administrador administrador) {
        return administradorService.salvarAdministrador(administrador);
    }

    @PutMapping("/{id}")
    public Administrador atualizarAdministrador(@PathVariable Long id, @RequestBody Administrador administrador) {
        administrador.setId(id);
        return administradorService.salvarAdministrador(administrador); 
    }

    @DeleteMapping("/{id}")
    public void excluirAdministrador(@PathVariable Long id) {
        administradorService.excluirAdministrador(id);  
    }   
        
}
