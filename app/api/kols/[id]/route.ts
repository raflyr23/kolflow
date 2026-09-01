import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const kol = await prisma.kOL.findUnique({ where: { id: id }, include: { campaign: true } });
  if (!kol || kol.campaign.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data = await request.json();
  const updatedKol = await prisma.kOL.update({
    where: { id: id },
    data
  });

  return NextResponse.json(updatedKol);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const kol = await prisma.kOL.findUnique({ where: { id: id }, include: { campaign: true } });
  if (!kol || kol.campaign.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.kOL.delete({ where: { id: id } });
  return NextResponse.json({ success: true });
}


