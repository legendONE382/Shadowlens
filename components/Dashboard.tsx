'use client';

import { useEffect, useState } from 'react';

type EventRow = {
  timestamp: string;
  tool: string;
  department: string;
  device: string;
  status: 'approved' | 'pending' | 'unapproved';
};

type ToolRow = {
  tool: string;
  category: string;
  status: 'approved' | 'pending' | 'unapproved';
  departments: string[];
  events: number;
  riskScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
};

type DashboardResponse = {
  filterOptions: {
    departments: string[];
    devices: string[];
  };
  stats: {
    totalTools: number;
    totalEvents: number;
    highRiskTools: number;
    unapprovedEvents: number;
  };
  tools: ToolRow[];
  events: EventRow[];
};

const defaultData: DashboardResponse = {
  filterOptions: {
    departments: [],
    devices: []
  },
  stats: { totalTools: 0, totalEvents: 0, highRiskTools: 0, unapprovedEvents: 0 },
  tools: [],
  events: []
};

export default function Dashboard() {
  const [department, setDepartment] = useState('all');
  const [device, setDevice] = useState('all');
  const [status, setStatus] = useState('all');
  const [windowDays, setWindowDays] = useState(30);
  const [data, setData] = useState<DashboardResponse>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      department,
      device,
      status,
      windowDays: String(windowDays)
    });

    const run = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/events?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Failed to load dashboard data (${response.status})`);
        }

        const payload: DashboardResponse = await response.json();
        setData(payload);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Unable to load dashboard data. Please retry.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [department, device, status, windowDays]);

  const timeline = (() => {
    const counts = new Map<string, number>();
    for (const event of data.events) {
      const day = event.timestamp.slice(5, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  })();

  const maxTimeline = Math.max(1, ...timeline.map(([, v]) => v));

  const downloadReport = () => {
    const params = new URLSearchParams({
      department,
      device,
      status,
      windowDays: String(windowDays)
    });
    window.location.href = `/api/report?${params.toString()}`;
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>ShadowLens</h1>
          <p>Know what AI tools your team is using before they become a problem.</p>
        </div>
        <button className="button" onClick={downloadReport}>Export Report</button>
      </header>

      {error ? <section className="panel error">{error}</section> : null}

      <section className="panel controls">
        <h2>Filters</h2>
        <div className="grid four">
          <label>Department
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="all">All</option>
              {data.filterOptions.departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </label>
          <label>Device
            <select value={device} onChange={(e) => setDevice(e.target.value)}>
              <option value="all">All</option>
              {data.filterOptions.devices.map((dev) => <option key={dev} value={dev}>{dev}</option>)}
            </select>
          </label>
          <label>Approval
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="unapproved">Unapproved</option>
            </select>
          </label>
          <label>Window
            <select value={windowDays} onChange={(e) => setWindowDays(Number(e.target.value))}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid four">
        <article className="panel"><h3>Tools</h3><p>{data.stats.totalTools}</p></article>
        <article className="panel"><h3>Events</h3><p>{data.stats.totalEvents}</p></article>
        <article className="panel"><h3>High Risk</h3><p className="danger">{data.stats.highRiskTools}</p></article>
        <article className="panel"><h3>Unapproved</h3><p className="warn">{data.stats.unapprovedEvents}</p></article>
      </section>

      <section className="panel">
        <h2>Tool Risk Overview</h2>
        {isLoading ? <p className="small">Loading…</p> : null}
        <table>
          <thead>
            <tr>
              <th>Tool</th><th>Category</th><th>Status</th><th>Departments</th><th>Events</th><th>Score</th><th>Level</th>
            </tr>
          </thead>
          <tbody>
            {data.tools.map((tool) => (
              <tr key={tool.tool}>
                <td>{tool.tool}</td>
                <td>{tool.category}</td>
                <td>{tool.status}</td>
                <td>{tool.departments.join(', ')}</td>
                <td>{tool.events}</td>
                <td>{tool.riskScore}</td>
                <td>{tool.riskLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Usage Timeline</h2>
        <div className="timeline">
          {timeline.map(([day, count]) => (
            <div className="row" key={day}>
              <span>{day}</span>
              <div className="bar"><div style={{ width: `${(count / maxTimeline) * 100}%` }} /></div>
              <strong>{count}</strong>
            </div>
          ))}
          {!timeline.length && !isLoading ? <p className="small">No events in this view.</p> : null}
        </div>
      </section>
    </main>
  );
}
