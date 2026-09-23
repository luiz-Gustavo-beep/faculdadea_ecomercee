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

import ribeiro_automoveis.com.site.model.Opcional;

import service.OpcionalService;

@RestController
@RequestMapping("/opcionais")
public class OpcionalController {


@Autowired
public OpcionalService opcionalService;

    @GetMapping
    public Iterable<Opcional> listarOpcionais() {
        return opcionalService.listarOpcionais();
    }

    @GetMapping("/{id}")
    public Opcional buscarOpcionalPorId(@PathVariable Long id) {
        return opcionalService.buscarOpcionalPorId(id);
    }

    @PostMapping
    public Opcional salvarOpcional(@RequestBody Opcional opcional) {
        return opcionalService.salvarOpcional(opcional);
    }

    @PutMapping("/{id}")
    public Opcional atualizarOpcional(@PathVariable Long id, @RequestBody Opcional opcional) {
        opcional.setId(id);
        return opcionalService.salvarOpcional(opcional);
    }

    @DeleteMapping("/{id}")
    public void excluirOpcional(@PathVariable Long id) {
        opcionalService.excluirOpcional(id);
    }


}
