import { ToolAggregate, UsageEvent } from '@/lib/types';

const statusWeight = { approved: 10, pending: 22, unapproved: 38 } as const;
const sensitivityWeight = { low: 10, medium: 20, high: 32 } as const;

type Filters = {
  department?: string;
  device?: string;
  status?: string;
  windowDays?: number;
};

export function applyFilters(events: UsageEvent[], filters: Filters): UsageEvent[] {
  const latest = events.reduce(
    (max, event) => Math.max(max, new Date(event.timestamp).getTime()),
    0
  );
  const days = filters.windowDays ?? 30;
  const cutoff = latest - days * 24 * 60 * 60 * 1000;

  return events.filter((event) => {
    const ts = new Date(event.timestamp).getTime();
    if (ts < cutoff) return false;
    if (filters.department && filters.department !== 'all' && event.department !== filters.department) return false;
    if (filters.device && filters.device !== 'all' && event.device !== filters.device) return false;
    if (filters.status && filters.status !== 'all' && event.status !== filters.status) return false;
    return true;
  });
}

export function aggregateTools(events: UsageEvent[]): ToolAggregate[] {
  const map = new Map<string, Omit<ToolAggregate, 'departments' | 'riskLevel'> & { departments: Set<string>; maxSensitivity: number }>();

  for (const event of events) {
    if (!map.has(event.tool)) {
      map.set(event.tool, {
        tool: event.tool,
        category: event.category,
        status: event.status,
        departments: new Set<string>(),
        events: 0,
        riskScore: 0,
        maxSensitivity: 0
      });
    }

    const row = map.get(event.tool)!;
    row.events += 1;
    row.departments.add(event.department);
    row.maxSensitivity = Math.max(row.maxSensitivity, sensitivityWeight[event.sensitivity]);
    if (statusWeight[event.status] > statusWeight[row.status]) {
      row.status = event.status;
    }
  }

  return [...map.values()]
    .map((row) => {
      const riskScore = Math.min(100, row.events * 6 + statusWeight[row.status] + row.maxSensitivity);
      const riskLevel = riskScore >= 75 ? 'High' : riskScore >= 45 ? 'Medium' : 'Low';
      return {
        tool: row.tool,
        category: row.category,
        status: row.status,
        departments: [...row.departments],
        events: row.events,
        riskScore,
        riskLevel
      } as ToolAggregate;
    })
    .sort((a, b) => b.riskScore - a.riskScore);
}
