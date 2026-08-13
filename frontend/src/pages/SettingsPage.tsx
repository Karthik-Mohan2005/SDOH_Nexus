import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, Database, Monitor, Save, CheckCircle2 } from 'lucide-react';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <div className="space-y-4">{children}</div>
  </Card>
);

const SettingRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({
  label,
  description,
  children,
}) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle: React.FC<{ enabled: boolean; onChange: (v: boolean) => void }> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      enabled ? 'bg-blue-600' : 'bg-slate-300'
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
        enabled ? 'translate-x-4.5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // Notification settings state
  const [notif, setNotif] = useState({
    highRiskAlerts: true,
    integrationAlerts: true,
    interventionReminders: true,
    weeklyDigest: false,
    criticalOnlyMode: false,
  });

  // Display settings state
  const [display, setDisplay] = useState({
    compactMode: false,
    showPrototypeDisclaimer: true,
    animationsEnabled: true,
    defaultRiskView: 'all',
  });

  // Risk threshold settings
  const [thresholds, setThresholds] = useState({
    criticalMin: 80,
    highMin: 60,
    moderateMin: 40,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your SDOH Nexus platform preferences, alerts, and display configuration."
        actions={
          <Button
            variant={saved ? 'secondary' : 'primary'}
            size="sm"
            icon={saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            onClick={handleSave}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Info */}
        <div className="space-y-6">
          <Section title="Your Profile" icon={<User className="h-4 w-4" />}>
            <div className="flex items-center gap-4 py-2">
              <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                {user?.avatarInitials || 'SM'}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5">{user?.role}</p>
              </div>
            </div>
            <SettingRow label="Organization" description="Your healthcare/payer organization">
              <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                {user?.organization || 'SDOH Nexus'}
              </span>
            </SettingRow>
            <SettingRow label="Access Level" description="Your platform role and permissions">
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Population Health Analyst
              </span>
            </SettingRow>
          </Section>

          {/* Data Layer Info */}
          <Section title="Data Sources Active" icon={<Database className="h-4 w-4" />}>
            {[
              { name: 'CDC Social Vulnerability Index', status: 'Active' },
              { name: 'US Census ACS 5-Year', status: 'Active' },
              { name: 'USDA Food Access Atlas', status: 'Active' },
              { name: 'EPA EJScreen', status: 'Active' },
              { name: 'HHS Health Resources (HRSA)', status: 'Active' },
            ].map(ds => (
              <SettingRow key={ds.name} label={ds.name}>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> {ds.status}
                </span>
              </SettingRow>
            ))}
          </Section>
        </div>

        {/* Right: Settings Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <Section title="Notification Preferences" icon={<Bell className="h-4 w-4" />}>
            <SettingRow
              label="High-Risk Member Alerts"
              description="Receive alerts when members transition to high or critical risk tiers"
            >
              <Toggle enabled={notif.highRiskAlerts} onChange={v => setNotif(p => ({ ...p, highRiskAlerts: v }))} />
            </SettingRow>
            <SettingRow
              label="Integration Pipeline Alerts"
              description="Notify on data enrichment failures or sync delays"
            >
              <Toggle enabled={notif.integrationAlerts} onChange={v => setNotif(p => ({ ...p, integrationAlerts: v }))} />
            </SettingRow>
            <SettingRow
              label="Intervention Reminders"
              description="Remind about unassigned or overdue intervention plans"
            >
              <Toggle enabled={notif.interventionReminders} onChange={v => setNotif(p => ({ ...p, interventionReminders: v }))} />
            </SettingRow>
            <SettingRow
              label="Weekly Population Health Digest"
              description="Summary email of SDOH trends, risk changes, and action items"
            >
              <Toggle enabled={notif.weeklyDigest} onChange={v => setNotif(p => ({ ...p, weeklyDigest: v }))} />
            </SettingRow>
            <SettingRow
              label="Critical Risk Only Mode"
              description="Only receive notifications for critical-tier events"
            >
              <Toggle enabled={notif.criticalOnlyMode} onChange={v => setNotif(p => ({ ...p, criticalOnlyMode: v }))} />
            </SettingRow>
          </Section>

          {/* Display Settings */}
          <Section title="Display & Interface" icon={<Monitor className="h-4 w-4" />}>
            <SettingRow
              label="Compact Table View"
              description="Reduce row padding in member and intervention tables"
            >
              <Toggle enabled={display.compactMode} onChange={v => setDisplay(p => ({ ...p, compactMode: v }))} />
            </SettingRow>
            <SettingRow
              label="Show Prototype Disclaimer"
              description="Display synthetic data notice banner across pages"
            >
              <Toggle enabled={display.showPrototypeDisclaimer} onChange={v => setDisplay(p => ({ ...p, showPrototypeDisclaimer: v }))} />
            </SettingRow>
            <SettingRow
              label="UI Animations"
              description="Enable smooth transitions and micro-animation effects"
            >
              <Toggle enabled={display.animationsEnabled} onChange={v => setDisplay(p => ({ ...p, animationsEnabled: v }))} />
            </SettingRow>
            <SettingRow label="Default Risk Filter" description="Which risk tier to show when opening Members page">
              <select
                value={display.defaultRiskView}
                onChange={e => setDisplay(p => ({ ...p, defaultRiskView: e.target.value }))}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical Only</option>
                <option value="high">High & Critical</option>
                <option value="moderate">Moderate & Above</option>
              </select>
            </SettingRow>
          </Section>

          {/* Risk Threshold Configuration */}
          <Section title="SDOH Risk Scoring Thresholds" icon={<Shield className="h-4 w-4" />}>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
              ⚠ Prototype Mode: Threshold adjustments are simulated and affect only the display layer.
            </div>
            <SettingRow label="Critical Risk Minimum Score" description="Score at which a member is flagged as Critical">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={70}
                  max={95}
                  value={thresholds.criticalMin}
                  onChange={e => setThresholds(p => ({ ...p, criticalMin: Number(e.target.value) }))}
                  className="w-16 text-xs text-center border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </SettingRow>
            <SettingRow label="High Risk Minimum Score" description="Score at which a member is flagged as High">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={50}
                  max={79}
                  value={thresholds.highMin}
                  onChange={e => setThresholds(p => ({ ...p, highMin: Number(e.target.value) }))}
                  className="w-16 text-xs text-center border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </SettingRow>
            <SettingRow label="Moderate Risk Minimum Score" description="Score at which a member is flagged as Moderate">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={25}
                  max={59}
                  value={thresholds.moderateMin}
                  onChange={e => setThresholds(p => ({ ...p, moderateMin: Number(e.target.value) }))}
                  className="w-16 text-xs text-center border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </SettingRow>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
};
