import { useMenuStore } from '@/stores/menuStore';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { NavLink } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => {
  const { getTopBarItems } = useMenuStore();
  const { activeUser } = useAuthStore();
  const { setTheme, theme } = useSettingsStore();
  const topItems = getTopBarItems(activeUser.permissions);

  return (
    <header className="topbar">
      <nav className="topbar__shortcuts">
        {topItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `topbar__link${isActive ? ' active' : ''}`}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
      <div className="topbar__actions">
        <span className="topbar__user">{activeUser.name}</span>
        <button className="topbar__theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
