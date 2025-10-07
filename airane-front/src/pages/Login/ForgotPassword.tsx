import { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const navigate = useNavigate();

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

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
            <Card className="max-w-md shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 -mt-4 -mx-4 mb-6">
                    <div className="flex justify-center mb-3">
                        <div className="bg-white rounded-full p-4 shadow-lg">
                            <i className="pi pi-lock text-orange-600 text-4xl"></i>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-center text-white mb-2">
                        Recuperar senha
                    </h1>
                    <p className="text-center text-orange-50 text-sm">
                        Informe o e-mail cadastrado para receber o link de redefinição
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-6">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="forgot-email" className="text-sm text-gray-700 font-medium">
                            E-mail
                        </label>
                        <InputText
                            id="forgot-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nome@dominio.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    {status === 'success' && (
                        <Message
                            severity="success"
                            text="Se o e-mail estiver cadastrado, você receberá o link em instantes."
                        />
                    )}

                    {status === 'error' && (
                        <Message
                            severity="error"
                            text="Não foi possível enviar o e-mail agora. Tente novamente."
                        />
                    )}

                    <Button
                        label="Enviar link"
                        icon={status === 'loading' ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'}
                        disabled={status === 'loading'}
                        className="w-full p-button-lg font-semibold"
                        style={{
                            background: 'linear-gradient(to right, #FF7A29, #FF9A56)',
                            border: 'none'
                        }}
                        type="submit"
                    />
                </form>

                <div className="text-center pb-4">
                    <Button
                        label="Voltar ao login"
                        className="p-button-link text-orange-600 font-semibold"
                        onClick={() => navigate('/')}
                        type="button"
                    />
                </div>
            </Card>
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