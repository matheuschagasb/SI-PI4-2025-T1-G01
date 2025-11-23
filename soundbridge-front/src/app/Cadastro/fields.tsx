import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

const Fields = ({ mode, formData, handleChange }) => {
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

    const inputClass =
        'w-full h-10 px-4 border border-gray-200 rounded-[999px] text-[12px] focus:border-blue-400 focus:ring-0';
    const inputStyle = { boxShadow: 'none', backgroundColor: '#fafafa' };

    return (
        <>
            {mode === 'contratante' && (
                <div className="flex flex-col gap-0">
                    <InputText
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        className={inputClass}
                        placeholder="Nome completo"
                        required
                        style={inputStyle}
                    />
                </div>
            )}

            {mode === 'musico' && (
                <>
                    <div className="flex flex-col gap-2">
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
                        <Dropdown
                            id="estado"
                            value={formData.estado}
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

export default Fields;