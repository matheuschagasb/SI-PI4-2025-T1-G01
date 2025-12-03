package comunicacao;

public class PedidoBuscarContratos extends Comunicado {
    private static final long serialVersionUID = 1L;
    
    private String usuarioId; // ID do músico ou contratante
    private String tipoUsuario; // "MUSICO" ou "CONTRATANTE"

    public PedidoBuscarContratos(String usuarioId, String tipoUsuario) throws Exception {
        if (usuarioId == null || usuarioId.trim().isEmpty())
            throw new Exception("UsuarioId ausente");
        if (tipoUsuario == null || tipoUsuario.trim().isEmpty())
            throw new Exception("Tipo de usuario ausente");

        this.usuarioId = usuarioId.trim();
        this.tipoUsuario = tipoUsuario.toUpperCase();
    }

    public String getUsuarioId() {
        return this.usuarioId;
    }

    public String getTipoUsuario() {
        return this.tipoUsuario;
    }

    public String toString() {
        return "PedidoBuscarContratos{usuarioId='" + usuarioId + "', tipo='" + tipoUsuario + "'}";
    }
}
