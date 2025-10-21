import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

const Fields = ({ mode, formData, handleChange }) => {

    const genres = [
        { label: 'Rock', value: 'rock' },
        { label: 'Pop', value: 'pop' },
        { label: 'Jazz', value: 'jazz' },
        { label: 'Clássica', value: 'classica' },
        { label: 'Sertanejo', value: 'sertanejo' },
        { label: 'Funk', value: 'funk' },
        { label: 'Eletrônica', value: 'eletronica' },
        { label: 'Hip Hop', value: 'hiphop' },
        { label: 'Reggae', value: 'reggae' },
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
        { label: 'Tocantins', value: 'TO' }
    ];

    return (
        <>
            {mode === 'contratante' && (
                <div className="flex flex-col gap-2">
                    <InputText
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        className="w-full"
                        placeholder="Nome completo"
                        required
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
                            className="w-full"
                            placeholder="Nome Artístico"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <InputTextarea
                            id="biografia"
                            value={formData.biografia}
                            onChange={(e) => handleChange('biografia', e.target.value)}
                            className="w-full"
                            placeholder="Biografia"
                            rows={5}
                            autoResize
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <InputText
                            id="cidade"
                            value={formData.cidade}
                            onChange={(e) => handleChange('cidade', e.target.value)}
                            className="w-full"
                            placeholder="Cidade"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Dropdown
                            id="estado"
                            value={formData.estado}
                            onChange={(e) => handleChange('estado', e.value)}
                            options={states}
                            placeholder="Estado"
                            className="w-full"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Dropdown
                            id="generoMusical"
                            value={formData.generoMusical}
                            onChange={(e) => handleChange('generoMusical', e.value)}
                            className="w-full"
                            placeholder="Gênero Musical"
                            required
                            options={genres}
                        />
                    </div>
                </>
            )}
        </>
    );
}

export default Fields;