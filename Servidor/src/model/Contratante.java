package model;

import java.io.Serializable;

public class Contratante implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String nome;
    private String email;
    private String telefone;
    private String nomeEstabelecimento;
    private String tipoEstabelecimento;
    private String fotoPerfil;

    // Construtor completo
    public Contratante(String id, String nome, String email, String telefone,
                       String nomeEstabelecimento, String tipoEstabelecimento, String fotoPerfil) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.nomeEstabelecimento = nomeEstabelecimento;
        this.tipoEstabelecimento = tipoEstabelecimento;
        this.fotoPerfil = fotoPerfil;
    }

    // Getters
    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getNomeEstabelecimento() { return nomeEstabelecimento; }
    public String getTipoEstabelecimento() { return tipoEstabelecimento; }
    public String getFotoPerfil() { return fotoPerfil; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setEmail(String email) { this.email = email; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setNomeEstabelecimento(String nomeEstabelecimento) { this.nomeEstabelecimento = nomeEstabelecimento; }
    public void setTipoEstabelecimento(String tipoEstabelecimento) { this.tipoEstabelecimento = tipoEstabelecimento; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }

    @Override
    public String toString() {
        return "Contratante{id='" + id + "', nome='" + nome + "', estabelecimento='" + nomeEstabelecimento + "'}";
    }
}
