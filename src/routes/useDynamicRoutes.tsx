import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useMenuStore } from '@/stores/menuStore';
import type { MenuItemNode, MenuTreeNode } from '@/types/menu';
import { loadDynamicComponent } from './componentRegistry';
import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingScreen from '@/components/common/LoadingScreen';

const traverseItems = (nodes: MenuTreeNode[], includeTest: boolean, permissions: string[]): MenuItemNode[] => {
  return nodes.flatMap((node) => {
    if (node.type === 'item') {
      const isTest = node.status === 'test';
      if (isTest && !includeTest) {
        return [];
      }
      if (node.status === 'inactive') {
        return [];
      }
      if (node.permissions && !node.permissions.some((permission: string) => permissions.includes(permission))) {
        return [];
      }
      return [node];
    }
    return traverseItems(node.children, includeTest, permissions);
  });
};

export const useDynamicRoutes = (): RouteObject[] => {
  const { activeUser, canAccessTest } = useAuthStore();
  const { getVisibleMenu, setActivePath } = useMenuStore();

  return useMemo(() => {
    const includeTest = canAccessTest();
    const visibleMenu = getVisibleMenu(activeUser.permissions, includeTest);

    const items = visibleMenu.flatMap((root) => traverseItems(root.children, includeTest, activeUser.permissions));

    const routes = items.map<RouteObject>((item) => {
      const Component = loadDynamicComponent(item.id, item.componentType);
      return {
        path: item.path,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Component />
          </Suspense>
        ),
        handle: {
          breadcrumb: item.title,
          onEnter: () => setActivePath(item.path),
        },
      };
    });

    return routes;
  }, [activeUser.permissions, canAccessTest, getVisibleMenu, setActivePath]);
};
