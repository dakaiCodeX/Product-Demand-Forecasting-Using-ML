import '@/components/common/HtmlScreen.css';
import { useState } from 'react';

const initialAlerts = [
  { id: 'a1', title: 'Model drift tespit edildi', severity: 'kritik', owner: 'Analitik' },
  { id: 'a2', title: 'Tahmin gecikmesi yüksek', severity: 'uyarı', owner: 'DevOps' }
];

const ModelMonitoring = () => {
  const [alerts] = useState(initialAlerts);

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Model İzleme</h1>
          <p>Üretimde çalışan modeller için sağlık göstergelerini izleyin.</p>
        </div>
      </header>
      <section className="table-card">
        <h2>Aktif Uyarılar</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Önem</th>
                <th>Sorumlu</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.title}</td>
                  <td>{alert.severity}</td>
                  <td>{alert.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ModelMonitoring;
