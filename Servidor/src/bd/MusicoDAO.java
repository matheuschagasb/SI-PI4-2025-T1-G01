package bd;

import model.Musico;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MusicoDAO {

    /**
     * Busca músico por email
     */
    public static Musico buscarPorEmail(String email) throws SQLException {
        String sql = "SELECT m.id, m.nome, m.biografia, m.cidade, m.estado, m.genero_musical, " +
                     "m.email, m.telefone, m.cpf, m.preco, m.chave_pix, m.foto_perfil " +
                     "FROM musico m WHERE m.email = ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String id = rs.getString("id");
                List<String> fotosBanda = buscarFotosBanda(id, conn);

                return new Musico(
                    rs.getString("id"),
                    rs.getString("nome"),
                    rs.getString("biografia"),
                    rs.getString("cidade"),
                    rs.getString("estado"),
                    rs.getString("genero_musical"),
                    rs.getString("email"),
                    rs.getString("telefone"),
                    rs.getString("cpf"),
                    rs.getString("preco"),
                    rs.getString("chave_pix"),
                    rs.getString("foto_perfil"),
                    fotosBanda
                );
            }
            return null;
        }
    }

    /**
     * Busca músico por ID
     */
    public static Musico buscarPorId(String id) throws SQLException {
        String sql = "SELECT m.id, m.nome, m.biografia, m.cidade, m.estado, m.genero_musical, " +
                     "m.email, m.telefone, m.cpf, m.preco, m.chave_pix, m.foto_perfil " +
                     "FROM musico m WHERE m.id = ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                List<String> fotosBanda = buscarFotosBanda(id, conn);

                return new Musico(
                    rs.getString("id"),
                    rs.getString("nome"),
                    rs.getString("biografia"),
                    rs.getString("cidade"),
                    rs.getString("estado"),
                    rs.getString("genero_musical"),
                    rs.getString("email"),
                    rs.getString("telefone"),
                    rs.getString("cpf"),
                    rs.getString("preco"),
                    rs.getString("chave_pix"),
                    rs.getString("foto_perfil"),
                    fotosBanda
                );
            }
            return null;
        }
    }

    /**
     * Busca todos os músicos ou filtra por gênero musical
     */
    public static List<Musico> buscarTodos(String generoMusical) throws SQLException {
        List<Musico> musicos = new ArrayList<>();
        String sql;

        if (generoMusical != null && !generoMusical.trim().isEmpty()) {
            sql = "SELECT m.id, m.nome, m.biografia, m.cidade, m.estado, m.genero_musical, " +
                  "m.email, m.telefone, m.cpf, m.preco, m.chave_pix, m.foto_perfil " +
                  "FROM musico m WHERE m.genero_musical = ?";
        } else {
            sql = "SELECT m.id, m.nome, m.biografia, m.cidade, m.estado, m.genero_musical, " +
                  "m.email, m.telefone, m.cpf, m.preco, m.chave_pix, m.foto_perfil " +
                  "FROM musico m";
        }

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            if (generoMusical != null && !generoMusical.trim().isEmpty()) {
                stmt.setString(1, generoMusical);
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                String id = rs.getString("id");
                List<String> fotosBanda = buscarFotosBanda(id, conn);

                Musico musico = new Musico(
                    rs.getString("id"),
                    rs.getString("nome"),
                    rs.getString("biografia"),
                    rs.getString("cidade"),
                    rs.getString("estado"),
                    rs.getString("genero_musical"),
                    rs.getString("email"),
                    rs.getString("telefone"),
                    rs.getString("cpf"),
                    rs.getString("preco"),
                    rs.getString("chave_pix"),
                    rs.getString("foto_perfil"),
                    fotosBanda
                );
                musicos.add(musico);
            }
        }

        return musicos;
    }

    /**
     * Busca fotos da banda de um músico
     */
    private static List<String> buscarFotosBanda(String musicoId, Connection conn) throws SQLException {
        List<String> fotos = new ArrayList<>();
        String sql = "SELECT foto_banda FROM musico_fotos WHERE musico_id = ?";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, musicoId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                fotos.add(rs.getString("foto_banda"));
            }
        }

        return fotos;
    }

    /**
     * Valida senha do músico (compara hash BCrypt)
     */
    public static boolean validarSenha(String email, String senhaPlainText) throws SQLException {
        String sql = "SELECT senha FROM musico WHERE email = ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String senhaHash = rs.getString("senha");
                // Usa BCrypt para comparar (assume que a senha no BD está com BCrypt)
                return BCryptUtil.checkPassword(senhaPlainText, senhaHash);
            }
            return false;
        }
    }
}
