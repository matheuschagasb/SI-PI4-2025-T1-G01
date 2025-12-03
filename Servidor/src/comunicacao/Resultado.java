package comunicacao;

public class Resultado extends Comunicado {
    private static final long serialVersionUID = 1L;
    
    private boolean sucesso;
    private String mensagem;
    private Object dados; // Pode conter lista de músicos, contratos, ou dados do usuário logado

    public Resultado(boolean sucesso, String mensagem, Object dados) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.dados = dados;
    }

    public Resultado(boolean sucesso, String mensagem) {
        this(sucesso, mensagem, null);
    }

    public boolean isSucesso() {
        return this.sucesso;
    }

    public String getMensagem() {
        return this.mensagem;
    }

    public Object getDados() {
        return this.dados;
    }

    public String toString() {
        return "Resultado{sucesso=" + sucesso + ", mensagem='" + mensagem + "', dados=" + (dados != null ? "presente" : "null") + "}";
    }
}
