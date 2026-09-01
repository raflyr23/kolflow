// Format IDR currency: 50000000 → "Rp 50.000.000"
export function formatCurrency(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// Format IDR currency compact: 50000000 -> "Rp 50M", 1500000000 -> "Rp 1.5B"
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000000) return 'Rp ' + (amount / 1000000000).toFixed(1) + 'B';
  if (amount >= 1000000) return 'Rp ' + (amount / 1000000).toFixed(1) + 'M';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// Smart number format: 1200 → "1.2K", 1500000 → "1.5M"
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Format date: "2026-06-01" → "Jun 1, 2026"
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Relative date: "2 hours ago", "3 days ago", "just now"
export function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateStr);
}

// Get initials from name: "Andi Pratama" → "AP"
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Generate deterministic color from string (for avatar backgrounds)
export function generateAvatarColor(name: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#eab308', '#84cc16', '#22c55e', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Calculate CPV (Cost Per View)
export function calculateCPV(cost: number, views: number): string {
  if (views === 0) return '-';
  return 'Rp ' + Math.round(cost / views).toLocaleString('id-ID');
}


// Calculate CPE (Cost Per Engagement)
export function calculateCPE(cost: number, views: number, engagementRate: number): string {
  if (views === 0 || engagementRate === 0) return '-';
  const engagements = views * (engagementRate / 100);
  return 'Rp ' + Math.round(cost / engagements).toLocaleString('id-ID');
}

// Export Campaign to CSV
export function exportCampaignToCSV(campaign: any) {
  const headers = ['KOL Name', 'Handle', 'Platform', 'Status', 'Cost/Post', 'Views', 'Engagement Rate', 'Link'];
  
  const csvContent = [
    headers.join(','),
    ...campaign.kols.map((kol: any) => {
      return [
        " + kol.name + ",
        '@' + kol.name.toLowerCase().replace(/\s+/g, ''),
        kol.platform,
        kol.status,
        kol.costPerPost,
        kol.views || 0,
        kol.engagementRate || 0,
        ''
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `campaign_${campaign.name.toLowerCase().replace(/\s+/g, '_')}_kols.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// Classname merger utility
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}





