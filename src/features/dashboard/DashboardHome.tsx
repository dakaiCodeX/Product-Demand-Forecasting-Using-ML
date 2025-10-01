import dashboard from '@/mocks/screens/dashboard.json';
import '@/components/common/HtmlScreen.css';

const DashboardHome = () => {
  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>{dashboard.title}</h1>
          <p>{dashboard.description}</p>
        </div>
      </header>
      <section className="cards-grid">
        {dashboard.cards.map((card) => (
          <article key={card.id} className="stat-card">
            <h2>{card.label}</h2>
            <p className="stat-card__value">{card.value}</p>
            {card.trend && <span className="stat-card__trend">{card.trend}</span>}
          </article>
        ))}
      </section>
      <section className="table-card">
        <h2>Kritik Ürün Performansı</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {dashboard.table.columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.table.rows.map((row) => (
                <tr key={row.sku}>
                  <td>{row.sku}</td>
                  <td>{row.name}</td>
                  <td>{row.accuracy}</td>
                  <td>{row.stockoutRisk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
