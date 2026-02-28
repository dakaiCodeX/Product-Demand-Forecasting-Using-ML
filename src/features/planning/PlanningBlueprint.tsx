import { useMemo, useState } from 'react';
import '@/components/common/HtmlScreen.css';

type ArchitectureLayer = {
  layer: string;
  owner: string;
  stack: string;
  output: string;
};

type RoadmapItem = {
  phase: string;
  timeline: string;
  target: string;
  deliverables: string[];
};

const architecture: ArchitectureLayer[] = [
  {
    layer: 'Veri Toplama & Kalite',
    owner: 'Data Engineering',
    stack: 'Airflow, dbt, Great Expectations',
    output: 'SKU-Mağaza günlük feature set ve kalite skoru',
  },
  {
    layer: 'Feature Store & MLOps',
    owner: 'ML Platform',
    stack: 'Feast, MLflow, Docker, GitHub Actions',
    output: 'Versiyonlu feature + model registry + CI/CD pipeline',
  },
  {
    layer: 'Tahmin Servisi',
    owner: 'ML Team',
    stack: 'XGBoost, LightGBM, Prophet Ensemble',
    output: 'D+1, W+12 demand forecast + güven aralığı',
  },
  {
    layer: 'Planlama & Aksiyon Motoru',
    owner: 'Supply Chain',
    stack: 'Safety stock optimizer, replenishment rules',
    output: 'Sipariş önerisi, promo etkisi, stockout alarmı',
  },
];

const roadmap: RoadmapItem[] = [
  {
    phase: 'Faz 1 — Temel Altyapı',
    timeline: '0-6 hafta',
    target: 'Tek source of truth ile güvenilir veri akışı',
    deliverables: ['ERP/POS/WMS entegrasyonları', 'Veri kalite dashboard', 'SKU-store bazlı eğitim dataseti'],
  },
  {
    phase: 'Faz 2 — Modelleme',
    timeline: '6-12 hafta',
    target: 'Pilot kategorilerde %20+ WAPE iyileşmesi',
    deliverables: ['Baseline + ensemble modeller', 'Backtesting framework', 'Model izleme metrikleri'],
  },
  {
    phase: 'Faz 3 — Planlama Otomasyonu',
    timeline: '12-18 hafta',
    target: 'Tahminden sipariş önerisine otomatik geçiş',
    deliverables: ['What-if senaryoları', 'S&OP cockpit', 'Onaylı sipariş API entegrasyonu'],
  },
];

const PlanningBlueprint = () => {
  const [weeklyDemand, setWeeklyDemand] = useState(4800);
  const [leadTimeWeeks, setLeadTimeWeeks] = useState(2);
  const [serviceLevel, setServiceLevel] = useState(95);
  const [demandStdDev, setDemandStdDev] = useState(430);

  const zScore = useMemo(() => {
    if (serviceLevel >= 99) return 2.33;
    if (serviceLevel >= 98) return 2.05;
    if (serviceLevel >= 97) return 1.88;
    if (serviceLevel >= 95) return 1.65;
    if (serviceLevel >= 90) return 1.28;
    return 1.04;
  }, [serviceLevel]);

  const safetyStock = Math.round(zScore * demandStdDev * Math.sqrt(Math.max(leadTimeWeeks, 1)));
  const reorderPoint = Math.round(weeklyDemand * leadTimeWeeks + safetyStock);
  const monthlyPurchasePlan = Math.round((weeklyDemand * 4 + safetyStock) * 1.04);

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Penti Talep Planlama Master Plan</h1>
          <p>Talep tahmini, üretim planlama ve tedarik önerilerini tek bir platformda birleştiren uçtan uca yol haritası.</p>
        </div>
      </header>

      <section className="cards-grid">
        <article className="stat-card">
          <h2>Hedef Forecast Accuracy</h2>
          <p className="stat-card__value">%88+</p>
          <span className="stat-card__trend">Top 200 SKU ilk hedef</span>
        </article>
        <article className="stat-card">
          <h2>Stokout Azaltımı</h2>
          <p className="stat-card__value">-%30</p>
          <span className="stat-card__trend">12 hafta sonrası</span>
        </article>
        <article className="stat-card">
          <h2>Faz Geçiş Süresi</h2>
          <p className="stat-card__value">18 hafta</p>
          <span className="stat-card__trend">Pilot → Production</span>
        </article>
      </section>

      <section className="table-card">
        <h2>Hedef Mimari</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Katman</th>
                <th>Sorumlu Takım</th>
                <th>Teknoloji</th>
                <th>Çıktı</th>
              </tr>
            </thead>
            <tbody>
              {architecture.map((item) => (
                <tr key={item.layer}>
                  <td>{item.layer}</td>
                  <td>{item.owner}</td>
                  <td>{item.stack}</td>
                  <td>{item.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-card">
        <h2>Roadmap</h2>
        <div className="roadmap-grid">
          {roadmap.map((item) => (
            <article key={item.phase} className="info-card">
              <h3>{item.phase}</h3>
              <p>
                <strong>Zaman:</strong> {item.timeline}
              </p>
              <p>
                <strong>Hedef:</strong> {item.target}
              </p>
              <ul>
                {item.deliverables.map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="table-card">
        <h2>Planlama Hesaplayıcı (Pilot)</h2>
        <div className="crud-form">
          <label>
            Haftalık Talep
            <input type="number" value={weeklyDemand} onChange={(event) => setWeeklyDemand(Number(event.target.value) || 0)} />
          </label>
          <label>
            Lead Time (hafta)
            <input type="number" value={leadTimeWeeks} onChange={(event) => setLeadTimeWeeks(Number(event.target.value) || 1)} />
          </label>
          <label>
            Servis Seviyesi (%)
            <input type="number" value={serviceLevel} onChange={(event) => setServiceLevel(Number(event.target.value) || 90)} />
          </label>
          <label>
            Talep Std Sapma
            <input type="number" value={demandStdDev} onChange={(event) => setDemandStdDev(Number(event.target.value) || 0)} />
          </label>
        </div>
        <div className="cards-grid planning-results">
          <article className="info-card">
            <h3>Safety Stock</h3>
            <p>{safetyStock.toLocaleString('tr-TR')} adet</p>
          </article>
          <article className="info-card">
            <h3>Reorder Point</h3>
            <p>{reorderPoint.toLocaleString('tr-TR')} adet</p>
          </article>
          <article className="info-card">
            <h3>Aylık Satın Alma Planı</h3>
            <p>{monthlyPurchasePlan.toLocaleString('tr-TR')} adet</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default PlanningBlueprint;
