// Guilherme Padilha - 24005138
'use client';
import { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

// Configuração PT-BR
addLocale('pt-BR', {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
});

interface AgendaMusicoProps {
    musicoId: string;
    isEditing: boolean;
}

export default function AgendaMusico({ musicoId, isEditing }: AgendaMusicoProps) {
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);

    // Carrega datas bloqueadas ao iniciar
    useEffect(() => {
        if (musicoId) {
            fetchBlockedDates();
        }
    }, [musicoId]);

    // Busca datas bloqueadas da API
    const fetchBlockedDates = async () => {
        try {
            const response = await fetch(`http://localhost:3001/v1/agenda/musico/${musicoId}`);
            if (response.ok) {
                const datesStrings: string[] = await response.json();
                const dates = datesStrings.map(dateStr => new Date(dateStr + 'T12:00:00'));
                setBlockedDates(dates);
            }
        } catch (error) {
            console.error("Erro ao buscar agenda:", error);
        }
    };

    // Bloqueia ou desbloqueia data selecionada
    const handleDateSelect = async (e: any) => {
        if (!isEditing) return;

        const selectedDate = e.value as Date;
        const dateStr = selectedDate.toISOString().split('T')[0];
        const token = localStorage.getItem('soundbridge/token');

        const isBlocked = blockedDates.some(d => d.toISOString().split('T')[0] === dateStr);

        try {
            if (isBlocked) {
                // Remove bloqueio
                await fetch(`http://localhost:3001/v1/agenda/desbloquear/${dateStr}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setBlockedDates(prev => prev.filter(d => d.toISOString().split('T')[0] !== dateStr));
            } else {
                // Bloqueia data
                await fetch(`http://localhost:3001/v1/agenda/bloquear`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ data: dateStr })
                });
                setBlockedDates(prev => [...prev, selectedDate]);
            }
        } catch (error) {
            console.error("Erro ao atualizar agenda:", error);
        }
    };

    // Renderiza estilo visual das datas bloqueadas
    const dateTemplate = (dateMeta: any) => {
        const date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
        const dateStr = date.toISOString().split('T')[0];
        const isBlocked = blockedDates.some(d => d.toISOString().split('T')[0] === dateStr);

        if (isBlocked) {
            return (
                <div className="flex justify-center items-center w-full h-full bg-red-100 text-red-600 rounded-full font-bold" title="Indisponível">
                    {dateMeta.day}
                </div>
            );
        }
        return dateMeta.day;
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full max-w-md">
                <Calendar 
                    value={null} 
                    onChange={handleDateSelect} 
                    inline 
                    locale="pt-BR"
                    dateTemplate={dateTemplate}
                    disabled={!isEditing}
                    className="w-full"
                    style={{ width: '100%' }}
                />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
                {isEditing ? "Clique para bloquear/desbloquear datas." : "Datas em vermelho estão indisponíveis."}
            </p>
        </div>
    );
}