package bd;

import org.mindrot.jbcrypt.BCrypt;

public class BCryptUtil {

    /**
     * Verifica se a senha em texto plano corresponde ao hash BCrypt
     */
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (Exception e) {
            System.err.println("⚠️  Erro ao validar senha BCrypt: " + e.getMessage());
            return false;
        }
    }

    /**
     * Gera hash BCrypt de uma senha (útil para testes)
     */
    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }
}
