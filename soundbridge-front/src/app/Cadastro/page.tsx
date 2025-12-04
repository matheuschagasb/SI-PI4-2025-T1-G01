'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import { Divider } from 'primereact/divider';
import Fields from './fields';

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
    cpf: '',
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

    const cleanedPhoneNumber = formData.telefone.replace(/\D/g, '');
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
      url = 'http://localhost:3001/v1/musico';
      payload = {
        nome: formData.nomeArtistico,
        cpf: formData.cpf,
        biografia: formData.biografia,
        cidade: formData.cidade,
        estado: formData.estado,
        generoMusical: formData.generoMusical,
        email: formData.email,
        telefone: cleanedPhoneNumber,
        senha: formData.password,
      };
    } else if (formData.role === 'contratante') {
      url = 'http://localhost:3001/v1/contratante';
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
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Não foi possível ler a resposta do servidor.' }));
        alert(`Erro no cadastro: ${errorData.message || 'Ocorreu um erro desconhecido.'}`);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
    }
  };

  const inputClass =
    'w-full h-10 px-4 border border-gray-200 rounded-[999px] text-[12px] focus:border-blue-400 focus:ring-0';
  const inputStyle = { boxShadow: 'none', backgroundColor: '#fafafa' };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white p-4 relative text-[13px]">

      <div className="w-full max-w-md bg-gray-50 rounded-[30px] shadow-sm px-8 py-8 border border-gray-100">
        <h1 className="text-center text-gray-800 mb-1 font-semibold text-[15px]">
          Criar conta
        </h1>
        <p className="text-center text-gray-500 text-[11px] mb-6">
          Preencha os dados para se cadastrar
        </p>

        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-10 px-6 py-2 bg-white rounded-full border border-gray-200">
            <label className="flex items-center cursor-pointer text-gray-700 text-[11px]">
              <RadioButton
                inputId="musico"
                name="role"
                value="musico"
                onChange={(e) => handleChange('role', e.value)}
                checked={formData.role === 'musico'}
                className="mr-2"
              />
              Músico
            </label>
            <label className="flex items-center cursor-pointer text-gray-700 text-[11px]">
              <RadioButton
                inputId="contratante"
                name="role"
                value="contratante"
                onChange={(e) => handleChange('role', e.value)}
                checked={formData.role === 'contratante'}
                className="mr-2"
              />
              Contratante
            </label>
          </div>
        </div>

        <Divider className="my-4" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Fields mode={formData.role} formData={formData} handleChange={handleChange} />

          <Divider className="my-4" />

          <InputText
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClass}
            placeholder="E-mail"
            autoComplete="email"
            required
            style={inputStyle}
          />

          <InputText
            id="telefone"
            value={formData.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            className={inputClass}
            placeholder="Telefone"
            required
            style={inputStyle}
          />

          <Password
            id="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full"
            inputClassName={inputClass}
            placeholder="Senha"
            pt={{
              root: { className: 'w-full' },
              input: { className: inputClass },
            }}
            toggleMask
            autoComplete="new-password"
            required
            inputStyle={inputStyle}
          />

          <Password
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className="w-full"
            inputClassName={inputClass}
            placeholder="Confirmar senha"
            pt={{
              root: { className: 'w-full' },
              input: { className: inputClass },
            }}
            feedback={false}
            toggleMask
            autoComplete="new-password"
            required
            inputStyle={inputStyle}
          />

          <Button
            label="CADASTRAR"
            icon="pi pi-check"
            iconPos="right"
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
            <span className="text-gray-500 text-[11px]">
              Já tem uma conta?{' '}
              <Button
                label="Entrar"
                className="p-button-link p-0 text-blue-500 font-semibold text-[11px]"
                onClick={() => router.push('/Login')}
                type="button"
                tabIndex={-1}
              />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}