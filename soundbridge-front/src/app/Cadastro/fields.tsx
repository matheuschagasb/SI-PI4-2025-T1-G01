// Thiago Mauri - 24015357

// Importa componentes de input do PrimeReact para campos de texto e dropdown
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

// Componente de campos reutilizáveis que varia de acordo com o "mode" (contratante ou musico)
const Fields = ({ mode, formData, handleChange }) => {
    // Opções de gêneros musicais para o Dropdown
    const genres = [
        { label: 'Rock', value: 'Rock' },
        { label: 'Pop', value: 'Pop' },
        { label: 'Jazz', value: 'Jazz' },
        { label: 'Clássica', value: 'Classica' },
        { label: 'Sertanejo', value: 'Sertanejo' },
        { label: 'Funk', value: 'Funk' },
        { label: 'Eletrônica', value: 'Eletronica' },
        { label: 'Hip Hop', value: 'Hiphop' },
        { label: 'Reggae', value: 'Reggae' },
    ];

    // Lista de estados brasileiros para o Dropdown
    const states = [
        { label: 'Acre', value: 'AC' },
        { label: 'Alagoas', value: 'AL' },
        { label: 'Amapá', value: 'AP' },
        { label: 'Amazonas', value: 'AM' },
        { label: 'Bahia', value: 'BA' },
        { label: 'Ceará', value: 'CE' },
        { label: 'Distrito Federal', value: 'DF' },
        { label: 'Espírito Santo', value: 'ES' },
        { label: 'Goiás', value: 'GO' },
        { label: 'Maranhão', value: 'MA' },
        { label: 'Mato Grosso', value: 'MT' },
        { label: 'Mato Grosso do Sul', value: 'MS' },
        { label: 'Minas Gerais', value: 'MG' },
        { label: 'Pará', value: 'PA' },
        { label: 'Paraíba', value: 'PB' },
        { label: 'Paraná', value: 'PR' },
        { label: 'Pernambuco', value: 'PE' },
        { label: 'Piauí', value: 'PI' },
        { label: 'Rio de Janeiro', value: 'RJ' },
        { label: 'Rio Grande do Norte', value: 'RN' },
        { label: 'Rio Grande do Sul', value: 'RS' },
        { label: 'Rondônia', value: 'RO' },
        { label: 'Roraima', value: 'RR' },
        { label: 'Santa Catarina', value: 'SC' },
        { label: 'São Paulo', value: 'SP' },
        { label: 'Sergipe', value: 'SE' },
        { label: 'Tocantins', value: 'TO' },
    ];

    // Classe base compartilhada entre todos os inputs (estilização com Tailwind)
    const inputClass =
        'w-full h-10 px-4 border border-gray-200 rounded-[999px] text-[12px] focus:border-blue-400 focus:ring-0';

    // Estilo inline adicional para tirar sombra padrão e alterar background
    const inputStyle = { boxShadow: 'none', backgroundColor: '#fafafa' };

    return (
        <>
            {/* Renderiza campos específicos se o modo for "contratante" */}
            {mode === 'contratante' && (
                <div className="flex flex-col gap-0">
                    {/* Campo de nome completo do contratante */}
                    <InputText
                        id="nome"
                        value={formData.nome}
                        // handleChange recebe o nome do campo e o novo valor
                        onChange={(e) => handleChange('nome', e.target.value)}
                        className={inputClass}
                        placeholder="Nome completo"
                        required
                        style={inputStyle}
                    />
                </div>
            )}

            {/* Renderiza campos específicos se o modo for "musico" */}
            {mode === 'musico' && (
                <>
                    <div className="flex flex-col gap-2">
                        {/* Nome artístico do músico */}
                        <InputText
                            id="nomeArtistico"
                            value={formData.nomeArtistico}
                            onChange={(e) => handleChange('nomeArtistico', e.target.value)}
                            className={inputClass}
                            placeholder="Nome Artístico"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* CPF do músico */}
                        <InputText
                            id="cpf"
                            value={formData.cpf}
                            onChange={(e) => handleChange('cpf', e.target.value)}
                            className={inputClass}
                            placeholder="CPF"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Biografia do músico (textarea com autoResize) */}
                        <InputTextarea
                            id="biografia"
                            value={formData.biografia}
                            onChange={(e) => handleChange('biografia', e.target.value)}
                            className="w-full px-4 border border-gray-200 rounded-[20px] text-[12px] focus:border-blue-400 focus:ring-0"
                            style={inputStyle}
                            placeholder="Biografia"
                            rows={4}
                            autoResize
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Cidade do músico */}
                        <InputText
                            id="cidade"
                            value={formData.cidade}
                            onChange={(e) => handleChange('cidade', e.target.value)}
                            className={inputClass}
                            placeholder="Cidade"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Dropdown de estado (usa lista 'states' definida acima) */}
                        <Dropdown
                            id="estado"
                            value={formData.estado}
                            // Em Dropdown do PrimeReact, o valor vem em e.value
                            onChange={(e) => handleChange('estado', e.value)}
                            options={states}
                            placeholder="Estado"
                            className={inputClass}
                            panelClassName="text-[12px]"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Dropdown de gênero musical (usa lista 'genres') */}
                        <Dropdown
                            id="generoMusical"
                            value={formData.generoMusical}
                            onChange={(e) => handleChange('generoMusical', e.value)}
                            options={genres}
                            placeholder="Gênero Musical"
                            className={inputClass}
                            panelClassName="text-[12px]"
                            required
                            style={inputStyle}
                        />
                    </div>
                </>
            )}
        </>
    );
};

// Exporta o componente para ser utilizado em outros arquivos
export default Fields;