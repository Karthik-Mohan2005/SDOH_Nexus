import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Tabs } from '../components/common/Tabs';
import {
  BookOpen,
  Database,
  ShieldCheck,
  Cpu,
  HeartPulse,
  MapPin,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Activity,
  AlertCircle,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is SDOH Nexus?',
    a: 'SDOH Nexus is an SDOH (Social Determinants of Health) intelligence and integration layer that enriches healthcare/payer member records with community-level social vulnerability, food access, economic, and environmental data to enable population health equity analytics.',
  },
  {
    q: 'Where does the SDOH data come from?',
    a: 'SDOH Nexus integrates five public datasets: CDC Social Vulnerability Index (SVI), US Census American Community Survey (ACS), USDA Food Access Research Atlas, EPA EJScreen (Environmental Justice), and HHS Health Resources and Services Administration (HRSA).',
  },
  {
    q: 'Is this using real patient data?',
    a: 'No. This is a prototype/hackathon demonstration using entirely synthetic member data generated to reflect realistic SDOH distributions. No real PHI (Protected Health Information) is used or stored.',
  },
  {
    q: 'What is the SDOH Risk Score?',
    a: 'The SDOH Risk Score (0-100) is a composite index derived from geographic enrichment of a member\'s census tract. It combines SVI, food access score, poverty rate, environmental burden, and healthcare access distance, weighted by predictive hospitalization impact.',
  },
  {
    q: 'How does the geographic matching work?',
    a: 'Members are matched to community-level SDOH data using ZIP code → county FIPS → census tract resolution. A hierarchical fallback ensures maximum match coverage even when precision geographic data is unavailable.',
  },
  {
    q: 'What are interventions in SDOH Nexus?',
    a: 'Interventions are AI-generated actionable care coordination recommendations targeting specific SDOH barriers (food access, transportation, housing). They can target individual members or entire communities and are tracked through the Intervention Center.',
  },
  {
    q: 'Can SDOH Nexus integrate with our existing payer/EHR system?',
    a: 'The architecture is designed as an integration layer. In production, the API service layer (currently using mock data) would connect to FHIR R4 patient resources and your existing claims/enrollment data. No member data replication is required.',
  },
];

const DATA_SOURCES = [
  {
    name: 'CDC Social Vulnerability Index (SVI)',
    url: 'https://www.atsdr.cdc.gov/placeandhealth/svi/',
    description: '15 US Census variables across 4 themes: socioeconomic status, household composition, minority status, and housing/transportation. Scored 0-1 per census tract.',
    icon: ShieldCheck,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    name: 'US Census Bureau ACS 5-Year',
    url: 'https://www.census.gov/programs-surveys/acs/',
    description: 'Poverty rate, unemployment, median household income, education attainment, health insurance coverage at census tract level.',
    icon: Database,
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    name: 'USDA Food Access Research Atlas',
    url: 'https://www.ers.usda.gov/data-products/food-access-research-atlas/',
    description: 'Identifies census tracts with limited access to healthy food stores by distance and income qualification, defining "food deserts."',
    icon: MapPin,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    name: 'EPA EJScreen',
    url: 'https://www.epa.gov/ejscreen',
    description: 'Environmental justice screening tool. Provides air quality, proximity to hazardous waste, traffic exposure, and drinking water indicators at block-group level.',
    icon: Activity,
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    name: 'HHS HRSA Data Warehouse',
    url: 'https://data.hrsa.gov/',
    description: 'Health professional shortage areas (HPSAs), medically underserved areas (MUAs), and community health center locations.',
    icon: HeartPulse,
    color: 'text-purple-600 bg-purple-50',
  },
];

export const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'data', label: 'Data Sources', icon: <Database className="h-4 w-4" /> },
    { id: 'faq', label: 'FAQ', icon: <AlertCircle className="h-4 w-4" /> },
    { id: 'architecture', label: 'Architecture', icon: <Cpu className="h-4 w-4" /> },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Help & Documentation"
        subtitle="Learn how SDOH Nexus works, what data it uses, and how to interpret the analytics."
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" /> What is SDOH Nexus?
              </CardTitle>
            </CardHeader>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>SDOH Nexus</strong> is a population health equity intelligence platform that enriches existing healthcare/payer member data with community-level Social Determinants of Health (SDOH) information from multiple authoritative public datasets.
              </p>
              <p>
                Unlike standalone analytics dashboards, SDOH Nexus is designed to operate as an <strong>integration and enrichment layer</strong> — it does not replace your existing EHR or claims system, but sits on top of it, enriching member records with geographic SDOH context.
              </p>
            </div>
          </Card>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Member Profiles', desc: 'View per-member SDOH risk scores, clinical utilization, and actionable intervention recommendations.', icon: HeartPulse, path: '/members', color: 'bg-blue-50 text-blue-600' },
              { title: 'Community Risk Map', desc: 'Interactive Leaflet map showing geographic SDOH vulnerability, community resources, and risk distribution.', icon: MapPin, path: '/communities', color: 'bg-emerald-50 text-emerald-600' },
              { title: 'SDOH Analytics', desc: 'Correlation scatter plots, domain radar charts, and automated insights revealing SDOH-outcome relationships.', icon: BarChart3, path: '/analytics', color: 'bg-purple-50 text-purple-600' },
              { title: 'Intervention Center', desc: 'Prioritized, assignable care coordination recommendations targeting specific SDOH barriers by member or community.', icon: ShieldCheck, path: '/interventions', color: 'bg-amber-50 text-amber-600' },
              { title: 'Data Integration Hub', desc: 'Pipeline status monitoring for all 5 connected SDOH datasets, with match rates and enrichment metrics.', icon: Database, path: '/integrations', color: 'bg-cyan-50 text-cyan-600' },
              { title: 'Risk Intelligence Engine', desc: 'Composite SDOH Risk Score (0-100) explaining risk factors with source attribution and outcome predictions.', icon: Cpu, path: '/members', color: 'bg-indigo-50 text-indigo-600' },
            ].map(feature => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  onClick={() => navigate(feature.path)}
                  className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className={`p-2.5 rounded-xl w-fit mb-3 ${feature.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                    Explore <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Prototype Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm mb-1">Prototype Demonstration Notice</p>
              <p className="leading-relaxed">
                This platform uses entirely <strong>synthetic, non-PHI member data</strong> generated to reflect realistic SDOH distributions. All risk scores, predictions, and intervention recommendations are analytical demonstrations and are <strong>not clinical diagnoses</strong>. SDOH Nexus is not FDA-cleared. In production, the data layer would connect to real FHIR R4 APIs and member enrollment systems.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources Tab */}
      {activeTab === 'data' && (
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium">
            All data sources used by SDOH Nexus are publicly available, authoritative government datasets. Geographic matching links member census tracts to these datasets for enrichment.
          </div>
          {DATA_SOURCES.map(src => {
            const Icon = src.icon;
            return (
              <Card key={src.name} hoverable>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${src.color} shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm">{src.name}</h3>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                      >
                        Official Source <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{src.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-3 mt-4">
          {FAQ_ITEMS.map((item, idx) => (
            <Card key={idx} hoverable padding="none">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 flex items-start justify-between gap-3"
              >
                <span className="font-semibold text-sm text-slate-900">{item.q}</span>
                <ChevronRight
                  className={`h-4 w-4 text-slate-400 shrink-0 mt-0.5 transition-transform ${
                    openFaq === idx ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">{item.a}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Architecture Tab */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
            </CardHeader>
            <div className="space-y-4 text-sm text-slate-700">
              <p>
                SDOH Nexus is architected as a <strong>layered enrichment system</strong>. The mock data service layer is designed to be swapped for real REST/FHIR API calls without changing any UI components.
              </p>
              <div className="bg-slate-900 rounded-xl p-5 text-xs font-mono text-slate-300 overflow-x-auto space-y-2">
                <div className="text-green-400">{'// SDOH Nexus Architecture (Frontend)'}</div>
                <div className="text-slate-400">{'[Healthcare Payer / EHR System]'}</div>
                <div className="pl-4 text-blue-300">{'↓ FHIR R4 Patient Resources'}</div>
                <div className="text-slate-400">{'[SDOH Nexus Integration Layer]'}</div>
                <div className="pl-4 text-yellow-300">{'↓ ZIP → FIPS → Census Tract Matching'}</div>
                <div className="text-slate-400">{'[External SDOH Data Pipeline]'}</div>
                <div className="pl-4 text-purple-300">{'↓ CDC SVI + Census ACS + USDA + EPA + HRSA'}</div>
                <div className="text-slate-400">{'[Risk Intelligence Engine]'}</div>
                <div className="pl-4 text-emerald-300">{'↓ Composite SDOH Score (0-100)'}</div>
                <div className="text-slate-400">{'[SDOH Nexus React Frontend]'}</div>
                <div className="pl-4 text-pink-300">{'↓ Dashboard / Members / Map / Analytics / Interventions'}</div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Card>
              <CardHeader><CardTitle>Frontend Stack</CardTitle></CardHeader>
              <ul className="space-y-2 text-slate-700">
                {['React 18 + TypeScript', 'Vite (Build Tool)', 'Tailwind CSS v4', 'React Router v6', 'Recharts (Charts)', 'React Leaflet (Maps)', 'Lucide React (Icons)', 'date-fns (Dates)'].map(s => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeader><CardTitle>Production Integration Points</CardTitle></CardHeader>
              <ul className="space-y-2 text-slate-700">
                {[
                  'FHIR R4 Patient API (member data)',
                  'FHIR R4 Claim resources (utilization)',
                  'CDC SVI REST API or S3 data lake',
                  'Census Bureau API (ACS 5-year)',
                  'USDA ERS Data API',
                  'EPA EJScreen API',
                  'OAuth2 / SMART on FHIR (auth)',
                  'REST or GraphQL API gateway',
                ].map(s => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
