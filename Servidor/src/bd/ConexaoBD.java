package bd;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class ConexaoBD {
    private static String url;
    private static String username;
    private static String password;
    private static String driver;

    static {
        carregarConfiguracoes();
    }

    private static void carregarConfiguracoes() {
        Properties props = new Properties();
        try {
            FileInputStream fis = new FileInputStream("resources/database.properties");
            props.load(fis);
            fis.close();

            url = props.getProperty("db.url");
            username = props.getProperty("db.username");
            password = props.getProperty("db.password");
            driver = props.getProperty("db.driver");

            // Registra o driver
            Class.forName(driver);

            System.out.println("✅ Configurações do banco de dados carregadas");
            System.out.println("   URL: " + url);
            System.out.println("   Usuario: " + username);

        } catch (IOException e) {
            System.err.println("❌ Erro ao carregar database.properties: " + e.getMessage());
            System.err.println("   Usando configurações padrão...");
            url = "jdbc:postgresql://localhost:5432/servidor-spring";
            username = "servidor-spring";
            password = "123qwe";
            driver = "org.postgresql.Driver";
        } catch (ClassNotFoundException e) {
            System.err.println("❌ Driver PostgreSQL não encontrado: " + e.getMessage());
            System.err.println("   Certifique-se de que postgresql.jar está no classpath!");
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    public static void testarConexao() {
        System.out.println("\n🔄 Testando conexão com o banco de dados...");
        try (Connection conn = getConnection()) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("✅ Conexão com o banco estabelecida com sucesso!");
            }
        } catch (SQLException e) {
            System.err.println("❌ ERRO ao conectar ao banco de dados:");
            System.err.println("   " + e.getMessage());
            System.err.println("\nVerifique se:");
            System.err.println("  1. PostgreSQL está rodando");
            System.err.println("  2. O banco 'servidor-spring' existe");
            System.err.println("  3. As credenciais em database.properties estão corretas");
        }
    }
}
