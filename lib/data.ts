import { UsageEvent } from '@/lib/types';

export const usageEvents: UsageEvent[] = [
  { timestamp: '2026-03-01T09:11:00Z', tool: 'ChatGPT', category: 'Writing assistant', department: 'Marketing', device: 'MacBook', status: 'approved', sensitivity: 'medium' },
  { timestamp: '2026-03-01T15:21:00Z', tool: 'Claude', category: 'Writing assistant', department: 'Support', device: 'Windows', status: 'pending', sensitivity: 'medium' },
  { timestamp: '2026-03-02T10:45:00Z', tool: 'Midjourney', category: 'Image generation', department: 'Design', device: 'MacBook', status: 'pending', sensitivity: 'low' },
  { timestamp: '2026-03-02T11:30:00Z', tool: 'GitHub Copilot', category: 'Code helper', department: 'Engineering', device: 'Linux', status: 'approved', sensitivity: 'high' },
  { timestamp: '2026-03-03T12:06:00Z', tool: 'Notion AI', category: 'Workspace assistant', department: 'Operations', device: 'Windows', status: 'approved', sensitivity: 'medium' },
  { timestamp: '2026-03-03T18:51:00Z', tool: 'Otter.ai', category: 'Meeting summarizer', department: 'Sales', device: 'iOS', status: 'unapproved', sensitivity: 'high' },
  { timestamp: '2026-03-12T10:17:00Z', tool: 'Perplexity', category: 'Research assistant', department: 'Product', device: 'MacBook', status: 'unapproved', sensitivity: 'medium' },
  { timestamp: '2026-03-16T08:32:00Z', tool: 'GitHub Copilot', category: 'Code helper', department: 'Engineering', device: 'Linux', status: 'approved', sensitivity: 'high' },
  { timestamp: '2026-03-22T12:27:00Z', tool: 'Gemini', category: 'General AI', department: 'Finance', device: 'Windows', status: 'pending', sensitivity: 'high' },
  { timestamp: '2026-03-30T10:22:00Z', tool: 'Claude', category: 'Writing assistant', department: 'Legal', device: 'MacBook', status: 'pending', sensitivity: 'high' }
];
