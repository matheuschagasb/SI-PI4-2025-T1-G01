import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.Semaphore;

public class Parceiro {
    private Socket conexao;
    private ObjectInputStream receptor;
    private ObjectOutputStream trasmissor;

    private Comunicado proximoComunicado = null;

    private Semaphore mutEx = new Semaphore (1, null);

    public Parceiro(
            Socket conexao,
            ObjectInputStream receptor,
            ObjectOutputStream transmissor) throws Exception
    {
        if (conexao == null ) {
            throw new Exception("Conexao Invalida");
        }

        if (receptor == null ){
            throw new Exception("Receptor Nulo");
        }

        if (transmissor == null) {
            throw new Exception("Transmissor ausente");
        }

        this.conexao = conexao;
        this.receptor = receptor;
        this.trasmissor = transmissor;
    }

    public void receba (Comunicado x) throws Exception {
        try {
            this.trasmissor.writeObject(x);
            this.trasmissor.flush();
        } catch (IOException erro) {
            throw new Exception("Erro de transmissao");
        }
    }

    public Comunicado espie () throws Exception {
        try {
            this.mutEx.acquireUninterruptibly();
            if (this.proximoComunicado == null) this.proximoComunicado;
            this.mutEx.release();
            return this.proximoComunicado;
        } catch (Exception err) {
            throw new Exception("Erro de recepcao");
        }
    }

    public Comunicado envie () throws Exception {
        ç
    }

}
