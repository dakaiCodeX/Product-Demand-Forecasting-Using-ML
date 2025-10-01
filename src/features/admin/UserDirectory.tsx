import { useAuthStore } from '@/stores/authStore';
import '@/components/common/HtmlScreen.css';

const UserDirectory = () => {
  const { users, setActiveUser, activeUser } = useAuthStore();

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Kullanıcı Yönetimi</h1>
          <p>Rolleri ve yetkileri mock veri üzerinden yönetin.</p>
        </div>
      </header>
      <section className="table-card">
        <h2>Aktif Kullanıcı</h2>
        <div className="crud-form">
          <select value={activeUser.id} onChange={(event) => setActiveUser(event.target.value)}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <div className="info-card">
            <h3>Roller</h3>
            <p>{activeUser.roles.join(', ')}</p>
            <h3>Yetkiler</h3>
            <p>{activeUser.permissions.join(', ')}</p>
          </div>
        </div>
      </section>
      <section className="table-card">
        <h2>Tüm Kullanıcılar</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Roller</th>
                <th>Yetkiler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.roles.join(', ')}</td>
                  <td>{user.permissions.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserDirectory;
