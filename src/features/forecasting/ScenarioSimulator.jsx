import { useState } from 'react';
import '@/components/common/HtmlScreen.css';

const initialScenarios = [
  { id: 's1', name: 'Ramazan Kampanyası', uplift: 18, status: 'Taslak' },
  { id: 's2', name: 'Yaz Tatili Talebi', uplift: 26, status: 'Yayında' }
];

const ScenarioSimulator = () => {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [name, setName] = useState('');
  const [uplift, setUplift] = useState(10);

  const handleAdd = () => {
    if (!name.trim()) return;
    setScenarios((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, uplift, status: 'Taslak' }
    ]);
    setName('');
    setUplift(10);
  };

  const handleDelete = (id) => {
    setScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Senaryo Simülatörü</h1>
          <p>Farklı talep dalgalanmalarını test edin ve sonuçları kıyaslayın.</p>
        </div>
      </header>
      <div className="table-card">
        <h2>Yeni Senaryo</h2>
        <div className="scenario-form">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Senaryo adı" />
          <label>
            Uplift (%):
            <input type="number" value={uplift} onChange={(event) => setUplift(Number(event.target.value))} />
          </label>
          <button onClick={handleAdd}>Ekle</button>
        </div>
      </div>
      <section className="table-card">
        <h2>Senaryolar</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Uplift</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr key={scenario.id}>
                  <td>{scenario.name}</td>
                  <td>%{scenario.uplift}</td>
                  <td>{scenario.status}</td>
                  <td>
                    <button className="ghost" onClick={() => handleDelete(scenario.id)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ScenarioSimulator;
