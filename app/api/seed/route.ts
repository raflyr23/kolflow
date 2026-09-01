import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { initialCampaigns } from '../../../lib/mockData';

export async function GET() {
  try {
    // 1. Create a test user
    const email = 'admin@kolflow.com';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Demo Admin'
        }
      });
    }

    // 2. Seed mock data if campaigns are empty
    const count = await prisma.campaign.count({ where: { userId: user.id } });
    if (count === 0) {
      for (const campaign of initialCampaigns) {
        const c = await prisma.campaign.create({
          data: {
            name: campaign.name,
            description: campaign.description,
            status: campaign.status,
            startDate: new Date(campaign.startDate),
            endDate: new Date(campaign.endDate),
            budget: campaign.budget,
            spent: campaign.spent,
            tags: JSON.stringify(campaign.tags),
            userId: user.id
          }
        });

        for (const kol of (campaign.kols || [])) {
          await prisma.kOL.create({
            data: {
              name: kol.name,
              platform: kol.platform,
              followers: kol.followers,
              contentTarget: kol.contentTarget,
              status: kol.status,
              views: kol.views,
              engagementRate: kol.engagementRate,
              costPerPost: kol.costPerPost,
              notes: kol.notes,
              campaignId: c.id
            }
          });
        }
      }
    }

    return NextResponse.json({ message: 'Seed successful', email: 'admin@kolflow.com', password: 'password123' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

