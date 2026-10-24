import React from 'react';
import {
  Activity,
  BarChart2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Terminal,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';

export const ApiUsagePage: React.FC = () => {
  const { apiKeys } = useSnapCut();

  const mockTraffic = [
    { id: 'req_01', path: '/api/v1/remove-background', status: 200, duration: '480ms', time: '10 mins ago', key: 'sc_live_4f9a...' },
    { id: 'req_02', path: '/api/v1/jobs', status: 200, duration: '610ms', time: '42 mins ago', key: 'sc_live_4f9a...' },
    { id: 'req_03', path: '/api/v1/jobs/job_sample_01', status: 200, duration: '45ms', time: '2 hours ago', key: 'sc_live_4f9a...' },
    { id: 'req_04', path: '/api/v1/remove-background', status: 400, duration: '22ms', time: '5 hours ago', key: 'sc_live_4f9a...', err: 'File exceeds 10MB limit' },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Developer API Usage & Telemetry
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time request metrics, status code distribution, and latency logs for your API keys.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Monthly API Requests</span>
            <div className="text-3xl font-extrabold text-white font-mono mt-2">
              1,240 <span className="text-xs text-slate-500 font-sans">/ 5,000</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[24.8%]" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Average Latency</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-2">
              520 ms
            </div>
            <p className="text-[11px] text-slate-500 mt-2">P95 latency across global edge</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Success Rate</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">
              99.8%
            </div>
            <p className="text-[11px] text-slate-500 mt-2">0 upstream provider timeouts</p>
          </div>
        </div>

        {/* Recent API Requests Log */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Recent Inbound Requests
            </h3>
            <span className="text-xs font-mono text-slate-500">Live Stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-6">Endpoint</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Response Time</th>
                  <th className="py-3 px-6">Key Prefix</th>
                  <th className="py-3 px-6 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {mockTraffic.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-6 font-semibold text-white">{req.path}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 200
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">{req.duration}</td>
                    <td className="py-3.5 px-6 text-cyan-400">{req.key}</td>
                    <td className="py-3.5 px-6 text-right text-slate-500">{req.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
