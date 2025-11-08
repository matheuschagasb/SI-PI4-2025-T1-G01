'use client';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('musico');
  const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log({ email, password, role });
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
            <Card className="max-w-md shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 -mt-4 -mx-4 mb-6">
                    <div className="flex justify-center mb-3">
                        <div className="bg-white rounded-full p-4 shadow-lg">
                            <i className="pi pi-music text-orange-600 text-4xl"></i>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-center text-white mb-2">Bem-vindo!</h1>
                    <p className="text-center text-orange-50 text-sm">Entre com seu e-mail para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-2">
                    <div className="bg-orange-50 rounded-lg p-4 border-orange-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Entrar como:</p>
                        <div className="flex justify-center gap-8">
                            <div className="flex items-center">
                                <RadioButton
                                    inputId="musico"
                                    name="role"
                                    value="musico"
                                    onChange={(e) => setRole(e.value)}
                                    checked={role === 'musico'}
                                />
                                <label htmlFor="musico" className="ml-2 text-orange-700 font-medium cursor-pointer">
                                    <i className="pi pi-user mr-1"></i>
                                    Músico
                                </label>
                            </div>
                            <div className="flex items-center">
                                <RadioButton
                                    inputId="contratante"
                                    name="role"
                                    value="contratante"
                                    onChange={(e) => setRole(e.value)}
                                    checked={role === 'contratante'}
                                />
                                <label htmlFor="contratante" className="ml-2 text-orange-700 font-medium cursor-pointer">
                                    <i className="pi pi-briefcase mr-1"></i>
                                    Contratante
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                            placeholder="E-mail"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            inputClassName="w-full"
                            placeholder="Senha"
                            pt={{
                                root: { className: 'w-full' },
                                input: { className: 'w-full' }
                            }}
                            feedback={false}
                            toggleMask
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="flex justify-end -mt-2">
                        <Button
                            label="Esqueceu a senha?"
                            className="p-button-link p-0 text-orange-600 text-sm"
                             onClick={() => router.push('/forgot-password')}
                            type="button"
                            tabIndex={-1}
                        />
                    </div>

                    <Button
                        label="Entrar"
                        icon="pi pi-sign-in"
                        className="w-full p-button-lg"
                        style={{ 
                            background: 'linear-gradient(to right, #FF7A29, #FF9A56)',
                            border: 'none',
                            fontWeight: 'bold'
                        }}
                        type="submit"
                    />

                    <div className="text-center mt-2 mb-4">
                        <span className="text-gray-600 text-sm">
                            Não tem uma conta?{' '}
                            <Button
                                label="Cadastre-se"
                                className="p-button-link p-0 text-orange-600 font-semibold"
                                    onClick={() => router.push('/Cadastro')}
                                type="button"
                                tabIndex={-1}
                            />
                        </span>
                    </div>
                </form>
            </Card>
        </div>
    );
}