import { NextRequest, NextResponse } from 'next/server';
import { usageEvents } from '@/lib/data';
import { aggregateTools, applyFilters, normalizeWindowDays } from '@/lib/risk';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    department: searchParams.get('department') ?? 'all',
    device: searchParams.get('device') ?? 'all',
    status: searchParams.get('status') ?? 'all',
    windowDays: normalizeWindowDays(Number(searchParams.get('windowDays') ?? '30'))
  };

  const filteredEvents = applyFilters(usageEvents, filters);
  const toolRows = aggregateTools(filteredEvents);

  const departments = [...new Set(usageEvents.map((event) => event.department))].sort();
  const devices = [...new Set(usageEvents.map((event) => event.device))].sort();

  return NextResponse.json({
    filters,
    filterOptions: {
      departments,
      devices
    },
    stats: {
      totalTools: toolRows.length,
      totalEvents: filteredEvents.length,
      highRiskTools: toolRows.filter((t) => t.riskLevel === 'High').length,
      unapprovedEvents: filteredEvents.filter((e) => e.status === 'unapproved').length
    },
    tools: toolRows,
    events: filteredEvents
  });
}
