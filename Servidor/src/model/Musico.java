package model;

import java.io.Serializable;
import java.util.List;

public class Musico implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String nome;
    private String biografia;
    private String cidade;
    private String estado;
    private String generoMusical;
    private String email;
    private String telefone;
    private String cpf;
    private String preco;
    private String chavePix;
    private String fotoPerfil;
    private List<String> fotosBanda;

    // Construtor completo
    public Musico(String id, String nome, String biografia, String cidade, String estado,
                  String generoMusical, String email, String telefone, String cpf,
                  String preco, String chavePix, String fotoPerfil, List<String> fotosBanda) {
        this.id = id;
        this.nome = nome;
        this.biografia = biografia;
        this.cidade = cidade;
        this.estado = estado;
        this.generoMusical = generoMusical;
        this.email = email;
        this.telefone = telefone;
        this.cpf = cpf;
        this.preco = preco;
        this.chavePix = chavePix;
        this.fotoPerfil = fotoPerfil;
        this.fotosBanda = fotosBanda;
    }

    // Getters
    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getBiografia() { return biografia; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
    public String getGeneroMusical() { return generoMusical; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getCpf() { return cpf; }
    public String getPreco() { return preco; }
    public String getChavePix() { return chavePix; }
    public String getFotoPerfil() { return fotoPerfil; }
    public List<String> getFotosBanda() { return fotosBanda; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setBiografia(String biografia) { this.biografia = biografia; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setGeneroMusical(String generoMusical) { this.generoMusical = generoMusical; }
    public void setEmail(String email) { this.email = email; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public void setPreco(String preco) { this.preco = preco; }
    public void setChavePix(String chavePix) { this.chavePix = chavePix; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }
    public void setFotosBanda(List<String> fotosBanda) { this.fotosBanda = fotosBanda; }

    @Override
    public String toString() {
        return "Musico{id='" + id + "', nome='" + nome + "', genero='" + generoMusical + "'}";
    }
}
