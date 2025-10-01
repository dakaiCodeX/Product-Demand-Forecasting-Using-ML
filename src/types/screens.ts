export interface DashboardCard {
  id: string;
  label: string;
  value: string;
  trend?: string;
}

export interface DashboardTableColumn {
  key: string;
  label: string;
}

export interface DashboardTableRow {
  sku: string;
  name: string;
  accuracy: string;
  stockoutRisk: string;
}

export interface DashboardScreenConfig {
  id: string;
  title: string;
  description: string;
  cards: DashboardCard[];
  table: {
    columns: DashboardTableColumn[];
    rows: DashboardTableRow[];
  };
}

export interface CrudColumn {
  key: string;
  label: string;
}

export interface CrudFilter {
  id: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
}

export interface CrudScreenConfig {
  id: string;
  title: string;
  description: string;
  filters: CrudFilter[];
  columns: CrudColumn[];
  rows: Record<string, string>[];
}
