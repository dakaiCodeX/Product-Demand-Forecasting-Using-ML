import { useMenuStore } from '@/stores/menuStore';
import { useMemo, useState } from 'react';
import '@/components/common/HtmlScreen.css';
import type { MenuTreeNode } from '@/types/menu';

interface EditableMenuItem {
  title: string;
  path: string;
  componentType: string;
  status: string;
  showInTopBar: boolean;
}

const buildTree = (nodes: MenuTreeNode[], depth = 0): { node: MenuTreeNode; depth: number }[] => {
  return nodes.flatMap((node) => {
    const current = [{ node, depth }];
    if (node.type !== 'item') {
      current.push(...buildTree(node.children, depth + 1));
    }
    return current;
  });
};

const MenuManagement = () => {
  const { menu } = useMenuStore();
  const [selected, setSelected] = useState<MenuTreeNode | null>(null);
  const editable = useMemo<EditableMenuItem | null>(() => {
    if (!selected || selected.type !== 'item') return null;
    return {
      title: selected.title,
      path: selected.path,
      componentType: selected.componentType,
      status: selected.status,
      showInTopBar: Boolean(selected.showInTopBar),
    };
  }, [selected]);

  const tree = useMemo(() => menu.flatMap((root) => buildTree(root.children)), [menu]);

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Menü Yönetimi</h1>
          <p>Geliştiricilerin hızlıca yeni ekranlar ekleyebileceği dinamik yapı.</p>
        </div>
      </header>
      <div className="menu-management">
        <section className="menu-management__tree">
          <h2>Menü Ağacı</h2>
          <ul>
            {tree.map(({ node, depth }) => (
              <li key={node.id} style={{ marginLeft: depth * 16 }}>
                <button
                  className={selected?.id === node.id ? 'active' : ''}
                  onClick={() => setSelected(node)}
                >
                  {node.title} <span className={`badge badge--${node.status}`}>{node.status}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="menu-management__form">
          <h2>Öğe Özellikleri</h2>
          {selected ? (
            <div className="crud-form">
              <label>
                Başlık
                <input value={selected.title} readOnly />
              </label>
              {selected.type === 'item' ? (
                <>
                  <label>
                    Path
                    <input value={selected.path} readOnly />
                  </label>
                  <label>
                    Bileşen Tipi
                    <input value={selected.componentType} readOnly />
                  </label>
                  <label className="inline">
                    <span>Üst Menüde Göster</span>
                    <input type="checkbox" checked={selected.showInTopBar ?? false} readOnly />
                  </label>
                </>
              ) : (
                <p>Bu öğe grup tipinde. Alt öğeleri sürükle-bırak ile sıralayabilirsiniz.</p>
              )}
              <label>
                Durum
                <input value={selected.status} readOnly />
              </label>
            </div>
          ) : (
            <p>Detay görmek için bir menü seçin.</p>
          )}
          {editable && (
            <div className="info-card">
              <h3>Geliştirici Notu</h3>
              <p>
                Bu ekran <strong>{editable.componentType}</strong> formatında geliştirildi ve rota <code>{editable.path}</code>{' '}
                olarak ayarlandı. Aktif hale getirmek için durumu <code>active</code> olarak güncelleyin.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MenuManagement;
