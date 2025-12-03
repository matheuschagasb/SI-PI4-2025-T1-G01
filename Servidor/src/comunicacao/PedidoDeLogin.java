package comunicacao;

public class PedidoDeLogin extends Comunicado {
    private static final long serialVersionUID = 1L;
    
    private String email;
    private String senha;
    private String role; // "MUSICO" ou "CONTRATANTE"

    public PedidoDeLogin(String email, String senha, String role) throws Exception {
        if (email == null || email.trim().isEmpty())
            throw new Exception("Email ausente");
        if (senha == null || senha.trim().isEmpty())
            throw new Exception("Senha ausente");
        if (role == null || role.trim().isEmpty())
            throw new Exception("Role ausente");

        this.email = email.trim();
        this.senha = senha;
        this.role = role.toUpperCase();
    }

    public String getEmail() {
        return this.email;
    }

    public String getSenha() {
        return this.senha;
    }

    public String getRole() {
        return this.role;
    }

    public String toString() {
        return "PedidoDeLogin{email='" + email + "', role='" + role + "'}";
    }
}
