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

import ribeiro_automoveis.com.site.model.Veiculo;

import service.VeiculoService;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    @Autowired
    public VeiculoService veiculoService;

    @GetMapping
    public Iterable<Veiculo> listarVeiculos() {
        return veiculoService.listarVeiculos();
    }

    @GetMapping("/{id}")
    public Veiculo buscarVeiculoPorId(@PathVariable Long id) {
        return veiculoService.buscarVeiculoPorId(id);
    }

    @PostMapping
    public Veiculo salvarVeiculo(@RequestBody Veiculo veiculo) {
        return veiculoService.salvarVeiculo(veiculo);
    }

    @PutMapping("/{id}")
    public Veiculo atualizarVeiculo(@PathVariable Long id, @RequestBody Veiculo veiculo) {
        return veiculoService.atualizarVeiculo(id, veiculo);
    }

    @DeleteMapping("/{id}")
    public void excluirVeiculo(@PathVariable Long id) {
        veiculoService.excluirVeiculo(id);
    }
}