package model;

import java.io.Serializable;
import java.time.LocalDateTime;

public class Contrato implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private Musico musico;
    private Contratante contratante;
    private LocalDateTime dataEvento;
    private Integer duracao;
    private Double valorTotal;
    private StatusContrato status;
    private String localEvento;
    private String observacoes;
    private LocalDateTime dataPagamento;
    private String comprovantePagamentoUrl;

    // Construtor completo
    public Contrato(String id, Musico musico, Contratante contratante, LocalDateTime dataEvento,
                    Integer duracao, Double valorTotal, StatusContrato status, String localEvento,
                    String observacoes, LocalDateTime dataPagamento, String comprovantePagamentoUrl) {
        this.id = id;
        this.musico = musico;
        this.contratante = contratante;
        this.dataEvento = dataEvento;
        this.duracao = duracao;
        this.valorTotal = valorTotal;
        this.status = status;
        this.localEvento = localEvento;
        this.observacoes = observacoes;
        this.dataPagamento = dataPagamento;
        this.comprovantePagamentoUrl = comprovantePagamentoUrl;
    }

    // Getters
    public String getId() { return id; }
    public Musico getMusico() { return musico; }
    public Contratante getContratante() { return contratante; }
    public LocalDateTime getDataEvento() { return dataEvento; }
    public Integer getDuracao() { return duracao; }
    public Double getValorTotal() { return valorTotal; }
    public StatusContrato getStatus() { return status; }
    public String getLocalEvento() { return localEvento; }
    public String getObservacoes() { return observacoes; }
    public LocalDateTime getDataPagamento() { return dataPagamento; }
    public String getComprovantePagamentoUrl() { return comprovantePagamentoUrl; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setMusico(Musico musico) { this.musico = musico; }
    public void setContratante(Contratante contratante) { this.contratante = contratante; }
    public void setDataEvento(LocalDateTime dataEvento) { this.dataEvento = dataEvento; }
    public void setDuracao(Integer duracao) { this.duracao = duracao; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public void setStatus(StatusContrato status) { this.status = status; }
    public void setLocalEvento(String localEvento) { this.localEvento = localEvento; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public void setDataPagamento(LocalDateTime dataPagamento) { this.dataPagamento = dataPagamento; }
    public void setComprovantePagamentoUrl(String comprovantePagamentoUrl) { this.comprovantePagamentoUrl = comprovantePagamentoUrl; }

    @Override
    public String toString() {
        return "Contrato{id='" + id + "', musico='" + musico.getNome() + 
               "', contratante='" + contratante.getNome() + "', data=" + dataEvento + ", status=" + status + "}";
    }
}
