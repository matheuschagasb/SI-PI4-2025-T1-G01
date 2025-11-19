"use client";

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await fakeSendResetEmail(email);
            setStatus('success');
        } catch (err) {
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const inputClass =
        'w-full h-10 px-4 border border-gray-200 rounded-[999px] text-[12px] focus:border-blue-400 focus:ring-0';
    const inputStyle = { boxShadow: 'none', backgroundColor: '#fafafa' };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white p-4 relative text-[13px]">

            <div className="w-full max-w-md bg-gray-50 rounded-[30px] shadow-sm px-8 py-8 border border-gray-100">
                <h1 className="text-center text-gray-800 mb-2 font-semibold text-[15px]">
                    Recuperar senha
                </h1>
                <p className="text-center text-gray-500 text-[11px] mb-6">
                    Informe o e-mail cadastrado para receber o link de redefinição
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <InputText
                        id="forgot-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="nome@dominio.com"
                        autoComplete="email"
                        required
                        style={inputStyle}
                    />

                    {status === 'success' && (
                        <Message
                            severity="success"
                            text="Se o e-mail estiver cadastrado, você receberá o link em instantes."
                            className="text-[11px]"
                        />
                    )}

                    {status === 'error' && (
                        <Message
                            severity="error"
                            text="Não foi possível enviar o e-mail agora. Tente novamente."
                            className="text-[11px]"
                        />
                    )}

                    <Button
                        label="Enviar link"
                        icon={status === 'loading' ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'}
                        iconPos="right"
                        disabled={status === 'loading'}
                        className="w-full h-10 text-white text-[11px] font-semibold pr-5 gap-1"
                        style={{
                            background: '#1379E6',
                            border: 'none',
                            borderRadius: '999px',
                            letterSpacing: '0.5px',
                        }}
                        type="submit"
                    />

                    <div className="text-center mt-3">
                        <Button
                            label="Voltar ao login"
                            className="p-button-link p-0 text-blue-500 font-semibold text-[11px]"
                            onClick={() => router.push('/')}
                            type="button"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

const fakeSendResetEmail = (email) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            email.includes('@') ? resolve(true) : reject();
        }, 1000);
    });

export default ForgotPassword;