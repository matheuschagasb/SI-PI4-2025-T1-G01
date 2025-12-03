package servidor;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

/**
 * Gerenciador de locks por recurso (músico) para evitar condições de corrida
 * em operações críticas como criação de contratos.
 * 
 * Quando múltiplos clientes tentam criar contratos com o mesmo músico simultaneamente,
 * este manager garante que apenas um por vez possa verificar disponibilidade e criar o contrato.
 */
public class MutexManager {
    private static final ConcurrentHashMap<String, Semaphore> mutexPorRecurso = new ConcurrentHashMap<>();

    /**
     * Adquire lock exclusivo para um recurso (bloqueante)
     */
    public static void adquirirLock(String recursoId) {
        Semaphore mutex = mutexPorRecurso.computeIfAbsent(recursoId, k -> new Semaphore(1));
        mutex.acquireUninterruptibly();
    }

    /**
     * Libera lock de um recurso
     */
    public static void liberarLock(String recursoId) {
        Semaphore mutex = mutexPorRecurso.get(recursoId);
        if (mutex != null) {
            mutex.release();
        }
    }

    /**
     * Remove mutex de um recurso (cleanup)
     */
    public static void removerMutex(String recursoId) {
        mutexPorRecurso.remove(recursoId);
    }

    /**
     * Retorna quantidade de recursos com locks ativos
     */
    public static int getTotalMutexAtivos() {
        return mutexPorRecurso.size();
    }
}
