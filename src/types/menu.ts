export type MenuStatus = 'active' | 'test' | 'inactive';
export type MenuComponentType = 'jsx' | 'tsx' | 'html' | 'builtin';
export type MenuNodeType = 'root' | 'group' | 'item';

export interface BaseMenuNode {
  id: string;
  title: string;
  type: MenuNodeType;
  icon?: string;
  status: MenuStatus;
  order: number;
}

export interface MenuItemNode extends BaseMenuNode {
  type: 'item';
  componentType: MenuComponentType;
  path: string;
  permissions?: string[];
  showInTopBar?: boolean;
}

export interface MenuGroupNode extends BaseMenuNode {
  type: 'group';
  children: MenuTreeNode[];
}

export interface MenuRootNode extends BaseMenuNode {
  type: 'root';
  children: MenuTreeNode[];
}

export type MenuTreeNode = MenuItemNode | MenuGroupNode;
export type MenuRoot = MenuRootNode;

export interface UserProfile {
  id: string;
  name: string;
  roles: string[];
  permissions: string[];
}
