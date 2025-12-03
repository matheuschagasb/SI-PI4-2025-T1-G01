package bd;

import model.Contratante;

import java.sql.*;

public class ContratanteDAO {

    /**
     * Busca contratante por email
     */
    public static Contratante buscarPorEmail(String email) throws SQLException {
        String sql = "SELECT id, nome, email, telefone, nome_estabelecimento, tipo_estabelecimento, foto_perfil " +
                     "FROM contratante WHERE email = ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Contratante(
                    rs.getString("id"),
                    rs.getString("nome"),
                    rs.getString("email"),
                    rs.getString("telefone"),
                    rs.getString("nome_estabelecimento"),
                    rs.getString("tipo_estabelecimento"),
                    rs.getString("foto_perfil")
                );
            }
            return null;
        }
    }

    /**
     * Busca contratante por ID
     */
    public static Contratante buscarPorId(String id) throws SQLException {
        String sql = "SELECT id, nome, email, telefone, nome_estabelecimento, tipo_estabelecimento, foto_perfil " +
                     "FROM contratante WHERE id = ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Contratante(
                    rs.getString("id"),
                    rs.getString("nome"),
                    rs.getString("email"),
                    rs.getString("telefone"),
                    rs.getString("nome_estabelecimento"),
                    rs.getString("tipo_estabelecimento"),
                    rs.getString("foto_perfil")
                );
            }
            return null;
        }
    }

    /**
     * Valida senha do contratante (compara hash BCrypt)
     */
    public static boolean validarSenha(String email, String senhaPlainText) throws SQLException {
        String sql = "SELECT senha FROM contratante WHERE email = ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String senhaHash = rs.getString("senha");
                return BCryptUtil.checkPassword(senhaPlainText, senhaHash);
            }
            return false;
        }
    }
}
