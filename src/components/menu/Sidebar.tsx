import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useMenuStore } from '@/stores/menuStore';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { MenuTreeNode } from '@/types/menu';
import clsx from 'clsx';
import './Sidebar.css';

const Sidebar = () => {
  const { getVisibleMenu, searchTerm, setSearchTerm, openGroups, toggleGroup } = useMenuStore();
  const { activeUser, canAccessTest } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useSettingsStore();

  const includeTest = canAccessTest();
  const visibleMenu = useMemo(
    () => getVisibleMenu(activeUser.permissions, includeTest),
    [activeUser.permissions, includeTest, getVisibleMenu]
  );

  const renderNode = (node: MenuTreeNode) => {
    if (node.type === 'item') {
      return (
        <NavLink
          key={node.id}
          to={node.path}
          className={({ isActive }) => clsx('sidebar__link', { 'sidebar__link--active': isActive })}
        >
          <span className="sidebar__bullet" />
          <span className="sidebar__label">{node.title}</span>
          {node.status === 'test' && <span className="sidebar__tag">Test</span>}
        </NavLink>
      );
    }

    const isOpen = openGroups[node.id];
    return (
      <div key={node.id} className="sidebar__group">
        <button className="sidebar__group-header" onClick={() => toggleGroup(node.id)}>
          <span>{node.title}</span>
          <span className={clsx('sidebar__chevron', { 'sidebar__chevron--open': isOpen })}>⌄</span>
        </button>
        {isOpen && <div className="sidebar__children">{node.children.map(renderNode)}</div>}
      </div>
    );
  };

  return (
    <aside className={clsx('sidebar', { 'sidebar--collapsed': sidebarCollapsed })}>
      <header className="sidebar__header">
        <button className="sidebar__collapse" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          ☰
        </button>
        {!sidebarCollapsed && <span className="sidebar__title">Forecasting Studio</span>}
      </header>
      {!sidebarCollapsed && (
        <div className="sidebar__search">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Menüde ara"
          />
        </div>
      )}
      <nav className="sidebar__nav">
        {visibleMenu.map((root) => (
          <div key={root.id} className="sidebar__root">
            {!sidebarCollapsed && <div className="sidebar__root-label">{root.title}</div>}
            <div className="sidebar__root-children">{root.children.map(renderNode)}</div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
