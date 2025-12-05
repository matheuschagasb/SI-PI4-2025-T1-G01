// Victor Ramalho - 24007532
import { redirect } from 'next/navigation';

type Props = {
  // Em rotas dinâmicas App Router, `params` aqui está tipado como Promise,
  // então o componente precisa ser async para fazer o await.
  params: Promise<{ id: string }>;
};

export default async function SoundBridgeMusicoRedirect({ params }: Props) {
  // Aguarda o params e desestrutura o `id` da URL dinâmica
  const { id } = await params;

  // Redireciona imediatamente para a página de perfil do músico com esse id
  redirect(`/Perfil/${id}`);
}