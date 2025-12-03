package servidor;

import comunicacao.Parceiro;

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.*;
import java.util.*;

public class AceitadoraDeConexao extends Thread {
    private ServerSocket pedido;
    private ArrayList<Parceiro> usuarios;
    private Set<String> ipsPermitidos;

    public AceitadoraDeConexao(String porta, String host, ArrayList<Parceiro> usuarios, Set<String> ipsPermitidos)
            throws Exception {
        if (porta == null)
            throw new Exception("Porta ausente");

        if (usuarios == null)
            throw new Exception("Usuarios ausentes");

        if (ipsPermitidos == null)
            throw new Exception("Lista de IPs permitidos ausente");

        try {
            this.pedido = new ServerSocket(Integer.parseInt(porta));
        } catch (Exception erro) {
            throw new Exception("Porta invalida ou ja em uso");
        }

        this.usuarios = usuarios;
        this.ipsPermitidos = ipsPermitidos;
    }

    public void run() {
        System.out.println("🔄 AceitadoraDeConexao iniciada e aguardando clientes...\n");

        for (;;) {
            Socket conexao = null;
            try {
                conexao = this.pedido.accept();

                // Validar IP do cliente
                String ipCliente = conexao.getInetAddress().getHostAddress();
                System.out.println("\n📡 Nova tentativa de conexão de: " + ipCliente);

                if (!isIpPermitido(ipCliente)) {
                    System.err.println("❌ IP NÃO AUTORIZADO: " + ipCliente);
                    System.err.println("   Conexão recusada por motivos de segurança.");
                    conexao.close();
                    continue;
                }

                System.out.println("✅ IP autorizado: " + ipCliente);
                System.out.println("🔗 Criando supervisora de conexão...");

                // Criar streams para comunicação
                ObjectOutputStream transmissor = new ObjectOutputStream(conexao.getOutputStream());
                ObjectInputStream receptor = new ObjectInputStream(conexao.getInputStream());

                // Criar Parceiro
                Parceiro parceiro = new Parceiro(conexao, receptor, transmissor);
                usuarios.add(parceiro);

                // Criar e iniciar supervisora
                SupervisoraDeConexao supervisoraDeConexao = new SupervisoraDeConexao(parceiro);
                supervisoraDeConexao.start();

            } catch (Exception erro) {
                System.err.println("⚠️  Erro ao processar conexão: " + erro.getMessage());
                try {
                    if (conexao != null && !conexao.isClosed()) {
                        conexao.close();
                    }
                } catch (Exception e) {
                    // Ignora erro ao fechar
                }
            }
        }
    }

    private boolean isIpPermitido(String ip) {
        // Verifica se o IP está na whitelist
        if (ipsPermitidos.contains(ip)) {
            return true;
        }

        // Trata IPv6 localhost
        if (ip.equals("0:0:0:0:0:0:0:1") || ip.equals("::1")) {
            return ipsPermitidos.contains("127.0.0.1") || ipsPermitidos.contains("localhost");
        }

        return false;
    }
}
