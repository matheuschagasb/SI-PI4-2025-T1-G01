package comunicacao;

import java.io.*;
import java.net.*;
import java.util.concurrent.Semaphore;

public class Parceiro {
    private Socket conexao;
    private ObjectInputStream receptor;
    private ObjectOutputStream transmissor;

    private Comunicado proximoComunicado = null;
    private Semaphore mutEx = new Semaphore(1, true);

    public Parceiro(Socket conexao, ObjectInputStream receptor, ObjectOutputStream transmissor) throws Exception {
        if (conexao == null)
            throw new Exception("Conexao ausente");
        if (receptor == null)
            throw new Exception("Receptor ausente");
        if (transmissor == null)
            throw new Exception("Transmissor ausente");

        this.conexao = conexao;
        this.receptor = receptor;
        this.transmissor = transmissor;
    }

    /**
     * Envia um comunicado para o cliente
     */
    public void receba(Comunicado x) throws Exception {
        try {
            this.transmissor.writeObject(x);
            this.transmissor.flush();
        } catch (IOException erro) {
            throw new Exception("Erro de transmissao: " + erro.getMessage());
        }
    }

    /**
     * Espía o próximo comunicado sem consumir (peek)
     */
    public Comunicado espie() throws Exception {
        try {
            this.mutEx.acquireUninterruptibly();
            if (this.proximoComunicado == null)
                this.proximoComunicado = (Comunicado) this.receptor.readObject();
            this.mutEx.release();
            return this.proximoComunicado;
        } catch (Exception erro) {
            throw new Exception("Erro de recepcao: " + erro.getMessage());
        }
    }

    /**
     * Recebe e consome o próximo comunicado
     */
    public Comunicado envie() throws Exception {
        try {
            if (this.proximoComunicado == null)
                this.proximoComunicado = (Comunicado) this.receptor.readObject();
            Comunicado ret = this.proximoComunicado;
            this.proximoComunicado = null;
            return ret;
        } catch (Exception erro) {
            throw new Exception("Erro de recepcao: " + erro.getMessage());
        }
    }

    /**
     * Fecha a conexão com o cliente
     */
    public void adeus() throws Exception {
        try {
            this.transmissor.close();
            this.receptor.close();
            this.conexao.close();
        } catch (Exception erro) {
            throw new Exception("Erro de desconexao: " + erro.getMessage());
        }
    }
}
