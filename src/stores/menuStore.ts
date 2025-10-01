import { create } from 'zustand';
import menuRaw from '@/mocks/menu.json';
import type { MenuItemNode, MenuRoot, MenuTreeNode } from '@/types/menu';
import { matchSorter } from '@/utils/matchSorter';

interface MenuState {
  menu: MenuRoot[];
  collapsed: boolean;
  searchTerm: string;
  openGroups: Record<string, boolean>;
  activePath?: string;
  setCollapsed: (collapsed: boolean) => void;
  setSearchTerm: (term: string) => void;
  toggleGroup: (id: string) => void;
  setActivePath: (path?: string) => void;
  getVisibleMenu: (permissions: string[], includeTest?: boolean) => MenuRoot[];
  getTopBarItems: (permissions: string[]) => MenuItemNode[];
}

const menuData = menuRaw as MenuRoot[];

const flattenGroups = (node: MenuTreeNode, acc: string[] = []): string[] => {
  if (node.type === 'group') {
    acc.push(node.id);
    node.children.forEach((child: MenuTreeNode) => flattenGroups(child, acc));
  }
  return acc;
};

const flattenRootGroups = (root: MenuRoot): string[] => {
  const ids: string[] = [];
  root.children.forEach((child: MenuTreeNode) => flattenGroups(child, ids));
  return ids;
};

const initialGroupsState = menuData.reduce<Record<string, boolean>>((acc, root) => {
  flattenRootGroups(root).forEach((id) => {
    acc[id] = true;
  });
  return acc;
}, {});

const filterByPermissions = (node: MenuTreeNode, permissions: string[], includeTest: boolean): MenuTreeNode | null => {
  if (node.status === 'inactive') {
    return null;
  }

  if (node.status === 'test' && !includeTest) {
    return null;
  }

  if (node.type === 'item') {
    if (node.permissions && !node.permissions.some((permission: string) => permissions.includes(permission))) {
      return null;
    }
    return node;
  }

  const children = node.children
    .map((child: MenuTreeNode) => filterByPermissions(child, permissions, includeTest))
    .filter(Boolean) as MenuTreeNode[];

  if (children.length === 0) {
    return null;
  }

  return { ...node, children };
};

const filterRoot = (root: MenuRoot, permissions: string[], includeTest: boolean): MenuRoot | null => {
  if (root.status === 'inactive') {
    return null;
  }

  const children = root.children
    .map((child: MenuTreeNode) => filterByPermissions(child, permissions, includeTest))
    .filter(Boolean) as MenuTreeNode[];

  if (children.length === 0) {
    return null;
  }

  return { ...root, children };
};

const searchMenu = (roots: MenuRoot[], term: string): MenuRoot[] => {
  if (!term.trim()) {
    return roots;
  }

  const filterNode = (node: MenuTreeNode): MenuTreeNode | null => {
    if (node.type === 'item') {
      return matchSorter(term, [node.title, node.path]) ? node : null;
    }

    const children = node.children
      .map((child: MenuTreeNode) => filterNode(child))
      .filter(Boolean) as MenuTreeNode[];

    if (children.length > 0 || matchSorter(term, [node.title])) {
      return { ...node, children };
    }

    return null;
  };

  return roots
    .map((root) => {
      const children = root.children
        .map((child: MenuTreeNode) => filterNode(child))
        .filter(Boolean) as MenuTreeNode[];

      if (children.length > 0 || matchSorter(term, [root.title])) {
        return { ...root, children };
      }

      return null;
    })
    .filter(Boolean) as MenuRoot[];
};

export const useMenuStore = create<MenuState>((set, get) => ({
  menu: menuData,
  collapsed: false,
  searchTerm: '',
  openGroups: initialGroupsState,
  setCollapsed: (collapsed) => set({ collapsed }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  toggleGroup: (id) => set((state) => ({
    openGroups: { ...state.openGroups, [id]: !state.openGroups[id] },
  })),
  setActivePath: (activePath) => set({ activePath }),
  getVisibleMenu: (permissions, includeTest = false) => {
    const filtered = menuData
      .map((root) => filterRoot(root, permissions, includeTest))
      .filter(Boolean) as MenuRoot[];
    const { searchTerm } = get();
    return searchMenu(filtered, searchTerm);
  },
  getTopBarItems: (permissions) => {
    const includeTest = true;
    const visible = get().getVisibleMenu(permissions, includeTest);
    const collectItems = (nodes: MenuTreeNode[]): MenuItemNode[] =>
      nodes.flatMap((node) => {
        if (node.type === 'item') {
          return node.showInTopBar ? [node] : [];
        }
        return collectItems(node.children);
      });
    return collectItems(visible.flatMap((root) => root.children));
  },
}));
