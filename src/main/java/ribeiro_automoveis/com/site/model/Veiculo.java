package ribeiro_automoveis.com.site.model;import java.math.BigDecimal;

import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;

import jakarta.persistence.GenerationType;

import jakarta.persistence.Id;

import jakarta.persistence.ManyToOne;

    @Entity

    public class Veiculo {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String marca;
        private String modelo;
        private Integer ano;
        private BigDecimal preco;
        private String descricao;
        @ManyToOne
        private Administrador administrador;   
       
        // Construtor
        public Veiculo() {
        }

        // Getters e Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getMarca() {
            return marca;
        }

        public void setMarca(String marca) {
            this.marca = marca;
        }

        public String getModelo() {
            return modelo;
        }

        public void setModelo(String modelo) {
            this.modelo = modelo;
        }

        public Integer getAno() {
            return ano;
        }

        public void setAno(Integer ano) {
            this.ano = ano;
        }

        public BigDecimal getPreco() {
            return preco;
        }

        public void setPreco(BigDecimal preco) {
            this.preco = preco;
        }

        public String getDescricao() {
            return descricao;
        }
        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }

        public Administrador getAdministrador() {
            return administrador;
        }
        public void setAdministrador(Administrador administrador) {
            this.administrador = administrador;
        }

    }
