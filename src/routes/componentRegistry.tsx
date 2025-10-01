import { lazy } from 'react';
import DashboardHome from '@/features/dashboard/DashboardHome';
import MenuManagement from '@/features/admin/MenuManagement';
import UserDirectory from '@/features/admin/UserDirectory';
import ExperienceSettings from '@/features/settings/ExperienceSettings';
import ModelMonitoring from '@/features/monitoring/ModelMonitoring';

const jsxRegistry: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  'dashboard-scenarios': () => import('@/features/forecasting/ScenarioSimulator.jsx'),
};

const tsxRegistry: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  'model-registry': () => import('@/features/forecasting/ModelRegistry'),
};

const htmlRegistry: Record<string, () => Promise<string>> = {
  'model-training': () => import('@/mocks/screens/modelTraining.html?raw').then((module) => module.default),
};

export const builtinRegistry: Record<string, React.ComponentType<any>> = {
  'dashboard-home': DashboardHome,
  'admin-menu': MenuManagement,
  'admin-users': UserDirectory,
  'admin-settings': ExperienceSettings,
  'model-monitoring': ModelMonitoring,
};

export const loadDynamicComponent = (id: string, type: 'jsx' | 'tsx' | 'html' | 'builtin') => {
  switch (type) {
    case 'builtin': {
      const Component = builtinRegistry[id];
      if (!Component) {
        throw new Error(`Bilinmeyen built-in bileşen: ${id}`);
      }
      return Component;
    }
    case 'jsx':
      if (!jsxRegistry[id]) {
        throw new Error(`Bilinmeyen JSX bileşeni: ${id}`);
      }
      return lazy(jsxRegistry[id]);
    case 'tsx':
      if (!tsxRegistry[id]) {
        throw new Error(`Bilinmeyen TSX bileşeni: ${id}`);
      }
      return lazy(tsxRegistry[id]);
    case 'html':
      return lazy(async () => {
        const html = await htmlRegistry[id]();
        const HtmlComponent = () => <div className="html-screen" dangerouslySetInnerHTML={{ __html: html }} />;
        return { default: HtmlComponent };
      });
    default:
      throw new Error(`Desteklenmeyen bileşen tipi: ${type}`);
  }
};
