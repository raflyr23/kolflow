import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const campaign = await prisma.campaign.findUnique({ where: { id: data.campaignId } });
  if (!campaign || campaign.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const kol = await prisma.kOL.create({
    data: {
      name: data.name,
      platform: data.platform,
      followers: data.followers || 0,
      contentTarget: data.contentTarget || 1,
      status: data.status || 'Contacted',
      views: data.views || 0,
      engagementRate: data.engagementRate || 0,
      costPerPost: data.costPerPost || 0,
      notes: data.notes || '',
      campaignId: data.campaignId
    }
  });

  return NextResponse.json(kol);
}

