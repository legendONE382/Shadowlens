import { NextRequest, NextResponse } from 'next/server';
import { usageEvents } from '@/lib/data';
import { aggregateTools, applyFilters } from '@/lib/risk';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    department: searchParams.get('department') ?? 'all',
    device: searchParams.get('device') ?? 'all',
    status: searchParams.get('status') ?? 'all',
    windowDays: Number(searchParams.get('windowDays') ?? '30')
  };

  const filteredEvents = applyFilters(usageEvents, filters);
  const tools = aggregateTools(filteredEvents);

  const header = ['tool', 'category', 'status', 'events', 'riskScore', 'riskLevel', 'departments'];
  const lines = [
    '# ShadowLens Export',
    `report_generated_at,${new Date().toISOString()}`,
    `events_in_scope,${filteredEvents.length}`,
    `tools_in_scope,${tools.length}`,
    '',
    header.join(','),
    ...tools.map((row) => [
      row.tool,
      row.category,
      row.status,
      row.events,
      row.riskScore,
      row.riskLevel,
      row.departments.join('|')
    ].join(','))
  ];

  return new NextResponse(lines.join('\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="shadowlens-report.csv"'
    }
  });
}
