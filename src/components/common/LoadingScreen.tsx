const LoadingScreen = () => (
  <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="spinner" />
    <span style={{ marginLeft: '12px' }}>Yükleniyor...</span>
  </div>
);

export default LoadingScreen;
