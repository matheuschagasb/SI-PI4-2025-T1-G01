'use client';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'musico' | 'contratante'>('musico');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha: password, role }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("DATA login", data)
                localStorage.setItem('soundbridge/token', data.token);
                localStorage.setItem('soundbridge/id', data.id);
                localStorage.setItem('soundbridge/nome', data.nome);
                localStorage.setItem('soundbridge/role', role);

                if (role === 'contratante') {
                    router.push('/Home');
                } else {
                    localStorage.setItem('soundbridge/cpf', data.cpf);
                    router.push('/Musico/Home');
                }
            } else if (response.status === 401) {
                setError('Email, senha ou perfil inválidos.');
            } else {
                setError('Ocorreu um erro. Tente novamente mais tarde.');
            }
        } catch (error) {
            setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full h-10 px-4 border border-gray-200 rounded-[999px] text-[12px] focus:border-blue-400 focus:ring-0';
    const inputStyle = { boxShadow: 'none', backgroundColor: '#fafafa' };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white p-4 relative text-[13px]">

            <div className="w-full max-w-md bg-gray-50 rounded-[30px] shadow-sm px-8 py-8 border border-gray-100">
                <h1 className="text-center text-gray-800 mb-6 font-semibold text-[15px]">
                    Login
                </h1>

                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-10 px-6 py-2 bg-white rounded-full border border-gray-200">
                        <label className="flex items-center cursor-pointer text-gray-700 text-[12px]">
                            <RadioButton
                                inputId="musico"
                                name="role"
                                value="musico"
                                onChange={(e) => setRole(e.value)}
                                checked={role === 'musico'}
                                className="mr-2"
                            />
                            Músico
                        </label>
                        <label className="flex items-center cursor-pointer text-gray-700 text-[12px]">
                            <RadioButton
                                inputId="contratante"
                                name="role"
                                value="contratante"
                                onChange={(e) => setRole(e.value)}
                                checked={role === 'contratante'}
                                className="mr-2"
                            />
                            Contratante
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="Email"
                        autoComplete="email"
                        required
                        style={inputStyle}
                    />

                    <Password
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        inputClassName={inputClass}
                        placeholder="Senha"
                        pt={{
                            root: { className: 'w-full' },
                            input: { className: inputClass },
                            toggleMask: { className: 'pr-4 text-gray-400' },
                        }}
                        feedback={false}
                        toggleMask
                        autoComplete="current-password"
                        required
                        inputStyle={inputStyle}
                    />

                    {/*
                    <div className="flex justify-end -mt-1 mb-1">
                        <Button
                            label="Esqueceu a senha?"SS
                            className="p-button-link p-0 text-blue-500 text-[11px]"
                            type="button"
                            onClick={() => router.push('/ForgotPassword')}
                            tabIndex={-1}
                        />SS
                    </div>
                    */}

                    {error && (
                        <div className="text-red-500 text-center text-xs mb-2">
                            {error}
                        </div>
                    )}

                    <Button
                        label={loading ? 'ENTRANDO...' : 'LOG IN'}
                        disabled={loading}
                        className="w-full h-10 text-white text-[11px] font-semibold"
                        style={{
                            background: '#1379E6',
                            border: 'none',
                            borderRadius: '999px',
                            letterSpacing: '0.5px',
                        }}
                        type="submit"
                    />

                    <div className="text-center mt-3">
                        <span className="text-gray-500 text-[11px]">
                            Não tem uma conta?{' '}
                            <Button
                                label="Cadastre-se"
                                className="p-button-link p-0 text-blue-500 font-semibold text-[11px]"
                                type="button"
                                onClick={() => router.push('/Cadastro')}
                                tabIndex={-1}
                            />
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}