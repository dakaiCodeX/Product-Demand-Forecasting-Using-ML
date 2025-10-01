import { PropsWithChildren, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import Sidebar from '@/components/menu/Sidebar';
import TopBar from '@/components/menu/TopBar';
import clsx from 'clsx';

const AppShell = ({ children }: PropsWithChildren) => {
  const {
    sidebarWidth,
    sidebarCollapsed,
    contentGap,
    scrollbarThickness,
    scrollbarColor,
    accent,
    theme,
    showTopbar,
  } = useSettingsStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    document.documentElement.style.setProperty('--content-gap', `${contentGap}px`);
    document.documentElement.style.setProperty('--scrollbar-size', `${scrollbarThickness}px`);
    document.documentElement.style.setProperty('--scrollbar-color', scrollbarColor);
    document.documentElement.style.setProperty('--accent-color', accent);
    document.body.dataset.theme = theme;
  }, [sidebarWidth, contentGap, scrollbarThickness, scrollbarColor, accent, theme]);

  return (
    <div className={clsx('app-shell', { 'app-shell--collapsed': sidebarCollapsed })}>
      <Sidebar />
      <div className="app-shell__content">
        {showTopbar && <TopBar />}
        <main className="app-shell__main">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
