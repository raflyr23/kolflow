export type KolStatus = 'Contacted' | 'Brief Sent' | 'Scheduled' | 'Published' | 'Completed';
export type CampaignStatus = 'Active' | 'Draft' | 'Completed';
export type Platform = 'Instagram' | 'TikTok' | 'YouTube';

export interface KOL {
  id: string;
  name: string;
  platform: Platform;
  followers: number;
  contentTarget: number;
  status: KolStatus;
  views: number;
  engagementRate: number;
  costPerPost: number;
  notes: string;
  addedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  tags: string[];
  kols: KOL[];
  createdAt: string;
  updatedAt: string;
}

export type ActivityAction = 'kol_added' | 'kol_removed' | 'status_changed' | 'campaign_created' | 'campaign_updated' | 'campaign_deleted' | 'campaign_status_changed' | 'kol_updated' | 'kol_status_changed';

export interface ActivityLog {
  id: string;
  campaignId?: string;
  campaignName?: string;
  kolId?: string;
  action: ActivityAction;
  detail: string;
  timestamp: string;
}