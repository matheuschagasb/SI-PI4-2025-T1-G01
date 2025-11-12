'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import Fields from './fields'; // garanta que este componente também seja client ("use client") se usar hooks

export default function Signup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    role: 'musico',
    nomeArtistico: '',
    biografia: '',
    cidade: '',
    estado: '',
    generoMusical: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    const cleanedPhoneNumber = formData.telefone.replace(/\D/g, '')
    if (cleanedPhoneNumber.length < 10 || cleanedPhoneNumber.length > 11) {
      alert('Por favor, insira um número de telefone válido (10 ou 11 dígitos com DDD).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    let url = '';
    let payload: any = {};

    if (formData.role === 'musico') {
      url = 'http://localhost:8080/v1/musico';
      payload = {
        nome: formData.nomeArtistico,
        biografia: formData.biografia,
        cidade: formData.cidade,
        estado: formData.estado,
        generoMusical: formData.generoMusical,
        email: formData.email,
        telefone: cleanedPhoneNumber,
        senha: formData.password,
      };
    } else if (formData.role === 'contratante') {
      url = 'http://localhost:8080/v1/contratante';
      payload = {
        nome: formData.nome,
        email: formData.email,
        telefone: cleanedPhoneNumber, 
        senha: formData.password,
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        router.push('/Login');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Não foi possível ler a resposta do servidor.' }));
        alert(`Erro no cadastro: ${errorData.message || 'Ocorreu um erro desconhecido.'}`);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md shadow-2xl rounded-2xl overflow-hidden w-full">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 -mt-4 -mx-4 mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <i className="pi pi-user-plus text-orange-600 text-4xl"></i>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-white mb-2">Criar Conta</h1>
          <p className="text-center text-orange-50 text-sm">Preencha os dados para se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-2">
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Cadastrar como:</p>
            <div className="flex justify-center gap-8">
              <div className="flex items-center">
                <RadioButton
                  inputId="musico"
                  name="role"
                  value="musico"
                  onChange={(e) => handleChange('role', e.value)}
                  checked={formData.role === 'musico'}
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
                  onChange={(e) => handleChange('role', e.value)}
                  checked={formData.role === 'contratante'}
                />
                <label htmlFor="contratante" className="ml-2 text-orange-700 font-medium cursor-pointer">
                  <i className="pi pi-briefcase mr-1"></i>
                  Contratante
                </label>
              </div>
            </div>
          </div>

          <Divider />

          {/* Campos dinâmicos conforme o papel selecionado */}
          <Fields mode={formData.role} formData={formData} handleChange={handleChange} />

          <Divider />

          <div className="flex flex-col gap-2">
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full"
              placeholder="E-mail"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <InputText
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              className="w-full"
              placeholder="Telefone"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Password
              id="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full"
              inputClassName="w-full"
              placeholder="Senha"
              pt={{
                root: { className: 'w-full' },
                input: { className: 'w-full' },
              }}
              toggleMask
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Password
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="w-full"
              inputClassName="w-full"
              placeholder="Confirmar senha"
              pt={{
                root: { className: 'w-full' },
                input: { className: 'w-full' },
              }}
              feedback={false}
              toggleMask
              autoComplete="new-password"
              required
            />
          </div>

          <Button
            label="Cadastrar"
            icon="pi pi-check"
            className="w-full p-button-lg"
            style={{
              background: 'linear-gradient(to right, #FF7A29, #FF9A56)',
              border: 'none',
              fontWeight: 'bold',
            }}
            type="submit"
          />

          <div>
            <span className="text-gray-600 text-sm">
              Já tem uma conta?{' '}
              <Button
                label="Entrar"
                className="p-button-link p-0 text-orange-600 font-semibold"
                onClick={() => router.push('/Login')}
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