import React, { useState } from 'react';
import { Card } from '../common/Card';
import type { IntegrationSource } from '../../types/integration';
import { CheckCircle2, ChevronDown, ChevronUp, Database } from 'lucide-react';

export const DataSourceCard: React.FC<{ source: IntegrationSource }> = ({ source }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card hoverable className="transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{source.displayName}</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{source.description}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 text-[11px]">Records Ingested</span>
          <p className="font-bold text-slate-900 mt-0.5">{source.records.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[11px]">Last Sync</span>
          <p className="font-bold text-slate-900 mt-0.5">{source.lastSync}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[11px]">Match Rate</span>
          <p className="font-bold text-emerald-600 mt-0.5">{source.matchRate}%</p>
        </div>
        <div>
          <span className="text-slate-400 text-[11px]">Format</span>
          <p className="font-medium text-slate-700 mt-0.5">{source.format}</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="text-slate-600">
            <strong>Endpoint:</strong> <code className="text-blue-600">{source.endpoint || 'Internal API'}</code>
          </p>
          <p className="text-slate-600">
            <strong>Failed/Unmatched Records:</strong> {source.failedRecords} records ({((source.failedRecords / source.records) * 100).toFixed(1)}%)
          </p>
          <p className="text-slate-500 text-[11px] pt-1">
            Enrichment Pipeline Status: Data validated and indexed against member census tracts.
          </p>
        </div>
      )}
    </Card>
  );
};
