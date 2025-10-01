import { useSettingsStore } from '@/stores/settingsStore';
import '@/components/common/HtmlScreen.css';

const ExperienceSettings = () => {
  const {
    theme,
    accent,
    scrollbarThickness,
    scrollbarColor,
    contentGap,
    showTopbar,
    setTheme,
    setAccent,
    setScrollbar,
    setContentGap,
    setShowTopbar,
  } = useSettingsStore();

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Deneyim Ayarları</h1>
          <p>Uygulamanın görünümünü kişiselleştirin. Tüm değişiklikler anında uygulanır.</p>
        </div>
      </header>
      <section className="table-card">
        <h2>Temalar</h2>
        <div className="crud-form">
          <label className="inline">
            <span>Tema</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}>
              <option value="light">Açık</option>
              <option value="dark">Koyu</option>
            </select>
          </label>
          <label className="inline">
            <span>Ana Renk</span>
            <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} />
          </label>
          <label className="inline">
            <span>Üst Menü</span>
            <input type="checkbox" checked={showTopbar} onChange={(event) => setShowTopbar(event.target.checked)} />
          </label>
        </div>
      </section>
      <section className="table-card">
        <h2>Scroll ve Boşluk</h2>
        <div className="crud-form">
          <label className="inline">
            <span>Scroll Kalınlığı</span>
            <input
              type="range"
              min={2}
              max={12}
              value={scrollbarThickness}
              onChange={(event) => setScrollbar(Number(event.target.value), scrollbarColor)}
            />
          </label>
          <label className="inline">
            <span>Scroll Rengi</span>
            <input type="color" value={scrollbarColor} onChange={(event) => setScrollbar(scrollbarThickness, event.target.value)} />
          </label>
          <label className="inline">
            <span>İçerik Boşluğu</span>
            <input type="range" min={8} max={48} value={contentGap} onChange={(event) => setContentGap(Number(event.target.value))} />
          </label>
        </div>
      </section>
    </div>
  );
};

export default ExperienceSettings;
