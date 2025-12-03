package comunicacao;

public class PedidoCriarContrato extends Comunicado {
    private static final long serialVersionUID = 1L;
    
    private String musicoId;
    private String emailContratante;
    private String data; // YYYY-MM-DD
    private String hora; // HH:MM
    private int duracao; // em horas
    private String localEvento;
    private String observacoes;

    public PedidoCriarContrato(String musicoId, String emailContratante, String data, 
                               String hora, int duracao, String localEvento, String observacoes) throws Exception {
        if (musicoId == null || musicoId.trim().isEmpty())
            throw new Exception("MusicoId ausente");
        if (emailContratante == null || emailContratante.trim().isEmpty())
            throw new Exception("Email do contratante ausente");
        if (data == null || data.trim().isEmpty())
            throw new Exception("Data ausente");
        if (hora == null || hora.trim().isEmpty())
            throw new Exception("Hora ausente");
        if (duracao <= 0)
            throw new Exception("Duracao invalida");
        if (localEvento == null || localEvento.trim().isEmpty())
            throw new Exception("Local do evento ausente");

        this.musicoId = musicoId.trim();
        this.emailContratante = emailContratante.trim();
        this.data = data.trim();
        this.hora = hora.trim();
        this.duracao = duracao;
        this.localEvento = localEvento.trim();
        this.observacoes = observacoes;
    }

    public String getMusicoId() {
        return this.musicoId;
    }

    public String getEmailContratante() {
        return this.emailContratante;
    }

    public String getData() {
        return this.data;
    }

    public String getHora() {
        return this.hora;
    }

    public int getDuracao() {
        return this.duracao;
    }

    public String getLocalEvento() {
        return this.localEvento;
    }

    public String getObservacoes() {
        return this.observacoes;
    }

    public String toString() {
        return "PedidoCriarContrato{musicoId='" + musicoId + "', data='" + data + "', hora='" + hora + "'}";
    }
}
