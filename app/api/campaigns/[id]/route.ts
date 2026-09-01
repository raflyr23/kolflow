import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const campaign = await prisma.campaign.findUnique({
    where: { id: id },
    include: { kols: true, activities: { orderBy: { timestamp: 'desc' } } }
  });

  if (!campaign || campaign.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();

  const campaign = await prisma.campaign.findUnique({ where: { id: id } });
  if (!campaign || campaign.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updateData: any = { ...data };
  if (data.tags) updateData.tags = JSON.stringify(data.tags);
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  const updatedCampaign = await prisma.campaign.update({
    where: { id: id },
    data: updateData,
    include: { kols: true, activities: true }
  });

  return NextResponse.json(updatedCampaign);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const campaign = await prisma.campaign.findUnique({ where: { id: id } });
  if (!campaign || campaign.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.campaign.delete({ where: { id: id } });

  return NextResponse.json({ success: true });
}


