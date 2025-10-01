import { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { useDynamicRoutes } from './useDynamicRoutes';
import Landing from './Landing';
import { useMenuStore } from '@/stores/menuStore';

const RouteRenderer = () => {
  const routes = useDynamicRoutes();
  const location = useLocation();
  const setActivePath = useMenuStore((state) => state.setActivePath);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname, setActivePath]);

  const element = useRoutes([
    ...routes,
    { path: '/', element: <Landing /> },
    { path: '*', element: <Landing /> },
  ]);

  return element;
};

export default RouteRenderer;
