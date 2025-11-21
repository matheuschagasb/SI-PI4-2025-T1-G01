import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SoundBridgeMusicoRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/Perfil/${id}`);
}
