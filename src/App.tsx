import AppShell from '@/layouts/AppShell';
import RouteRenderer from '@/routes/RouteRenderer';
import '@/layouts/AppShell.css';

const App = () => {
  return (
    <AppShell>
      <RouteRenderer />
    </AppShell>
  );
};

export default App;
