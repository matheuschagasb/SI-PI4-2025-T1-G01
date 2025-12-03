package bd;

import model.*;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ContratoDAO {

    /**
     * Cria um novo contrato
     */
    public static Contrato criar(String musicoId, String contratanteId, LocalDateTime dataEvento,
                                 int duracao, double valorTotal, String localEvento, String observacoes) throws SQLException {
        String sql = "INSERT INTO contrato (id, musico_id, contratante_id, data_evento, duracao, " +
                     "valor_total, status, local_evento, observacoes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String novoId = UUID.randomUUID().toString();

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, novoId);
            stmt.setString(2, musicoId);
            stmt.setString(3, contratanteId);
            stmt.setTimestamp(4, Timestamp.valueOf(dataEvento));
            stmt.setInt(5, duracao);
            stmt.setDouble(6, valorTotal);
            stmt.setString(7, StatusContrato.PENDENTE.name());
            stmt.setString(8, localEvento);
            stmt.setString(9, observacoes);

            stmt.executeUpdate();

            // Busca o contrato recém-criado
            return buscarPorId(novoId);
        }
    }

    /**
     * Busca contrato por ID
     */
    public static Contrato buscarPorId(String id) throws SQLException {
        String sql = "SELECT c.id, c.musico_id, c.contratante_id, c.data_evento, c.duracao, " +
                     "c.valor_total, c.status, c.local_evento, c.observacoes, c.data_pagamento, " +
                     "c.comprovante_pagamento_url " +
                     "FROM contrato c WHERE c.id = ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Musico musico = MusicoDAO.buscarPorId(rs.getString("musico_id"));
                Contratante contratante = ContratanteDAO.buscarPorId(rs.getString("contratante_id"));

                Timestamp dataPagTs = rs.getTimestamp("data_pagamento");
                LocalDateTime dataPagamento = dataPagTs != null ? dataPagTs.toLocalDateTime() : null;

                return new Contrato(
                    rs.getString("id"),
                    musico,
                    contratante,
                    rs.getTimestamp("data_evento").toLocalDateTime(),
                    rs.getInt("duracao"),
                    rs.getDouble("valor_total"),
                    StatusContrato.valueOf(rs.getString("status")),
                    rs.getString("local_evento"),
                    rs.getString("observacoes"),
                    dataPagamento,
                    rs.getString("comprovante_pagamento_url")
                );
            }
            return null;
        }
    }

    /**
     * Busca contratos de um músico
     */
    public static List<Contrato> buscarPorMusicoId(String musicoId) throws SQLException {
        List<Contrato> contratos = new ArrayList<>();
        String sql = "SELECT c.id, c.musico_id, c.contratante_id, c.data_evento, c.duracao, " +
                     "c.valor_total, c.status, c.local_evento, c.observacoes, c.data_pagamento, " +
                     "c.comprovante_pagamento_url " +
                     "FROM contrato c WHERE c.musico_id = ? ORDER BY c.data_evento DESC";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, musicoId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Musico musico = MusicoDAO.buscarPorId(rs.getString("musico_id"));
                Contratante contratante = ContratanteDAO.buscarPorId(rs.getString("contratante_id"));

                Timestamp dataPagTs = rs.getTimestamp("data_pagamento");
                LocalDateTime dataPagamento = dataPagTs != null ? dataPagTs.toLocalDateTime() : null;

                Contrato contrato = new Contrato(
                    rs.getString("id"),
                    musico,
                    contratante,
                    rs.getTimestamp("data_evento").toLocalDateTime(),
                    rs.getInt("duracao"),
                    rs.getDouble("valor_total"),
                    StatusContrato.valueOf(rs.getString("status")),
                    rs.getString("local_evento"),
                    rs.getString("observacoes"),
                    dataPagamento,
                    rs.getString("comprovante_pagamento_url")
                );
                contratos.add(contrato);
            }
        }

        return contratos;
    }

    /**
     * Busca contratos de um contratante
     */
    public static List<Contrato> buscarPorContratanteId(String contratanteId) throws SQLException {
        List<Contrato> contratos = new ArrayList<>();
        String sql = "SELECT c.id, c.musico_id, c.contratante_id, c.data_evento, c.duracao, " +
                     "c.valor_total, c.status, c.local_evento, c.observacoes, c.data_pagamento, " +
                     "c.comprovante_pagamento_url " +
                     "FROM contrato c WHERE c.contratante_id = ? ORDER BY c.data_evento DESC";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, contratanteId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Musico musico = MusicoDAO.buscarPorId(rs.getString("musico_id"));
                Contratante contratante = ContratanteDAO.buscarPorId(rs.getString("contratante_id"));

                Timestamp dataPagTs = rs.getTimestamp("data_pagamento");
                LocalDateTime dataPagamento = dataPagTs != null ? dataPagTs.toLocalDateTime() : null;

                Contrato contrato = new Contrato(
                    rs.getString("id"),
                    musico,
                    contratante,
                    rs.getTimestamp("data_evento").toLocalDateTime(),
                    rs.getInt("duracao"),
                    rs.getDouble("valor_total"),
                    StatusContrato.valueOf(rs.getString("status")),
                    rs.getString("local_evento"),
                    rs.getString("observacoes"),
                    dataPagamento,
                    rs.getString("comprovante_pagamento_url")
                );
                contratos.add(contrato);
            }
        }

        return contratos;
    }

    /**
     * Verifica conflitos de horário para um músico
     */
    public static boolean verificarConflito(String musicoId, LocalDateTime inicioEvento, LocalDateTime fimEvento) throws SQLException {
        String sql = "SELECT COUNT(*) as total FROM contrato " +
                     "WHERE musico_id = ? AND status = ? " +
                     "AND data_evento < ? " +
                     "AND (data_evento + (duracao * interval '1 hour')) > ?";

        try (Connection conn = ConexaoBD.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, musicoId);
            stmt.setString(2, StatusContrato.CONFIRMADO.name());
            stmt.setTimestamp(3, Timestamp.valueOf(fimEvento));
            stmt.setTimestamp(4, Timestamp.valueOf(inicioEvento));

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("total") > 0;
            }
        }

        return false;
    }
}
