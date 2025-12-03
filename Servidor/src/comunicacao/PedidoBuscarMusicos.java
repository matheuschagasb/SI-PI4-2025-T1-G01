package comunicacao;

public class PedidoBuscarMusicos extends Comunicado {
    private static final long serialVersionUID = 1L;
    
    private String generoMusical; // Pode ser null para buscar todos

    public PedidoBuscarMusicos(String generoMusical) {
        this.generoMusical = generoMusical;
    }

    public String getGeneroMusical() {
        return this.generoMusical;
    }

    public String toString() {
        return "PedidoBuscarMusicos{genero='" + (generoMusical != null ? generoMusical : "TODOS") + "'}";
    }
}
