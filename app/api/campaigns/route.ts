import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    include: { kols: true, activities: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const campaign = await prisma.campaign.create({
    data: {
      name: data.name,
      description: data.description,
      status: data.status || 'Active',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      budget: data.budget || 0,
      spent: data.spent || 0,
      tags: JSON.stringify(data.tags || []),
      userId: session.user.id
    },
    include: { kols: true, activities: true }
  });

  return NextResponse.json(campaign);
}

