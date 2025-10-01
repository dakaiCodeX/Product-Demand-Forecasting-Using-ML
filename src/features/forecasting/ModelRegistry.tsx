import modelRegistry from '@/mocks/screens/modelRegistry.json';
import type { CrudScreenConfig } from '@/types/screens';
import '@/components/common/HtmlScreen.css';
import { useState } from 'react';

type RegistryRecord = CrudScreenConfig['rows'][number];

const ModelRegistry = () => {
  const [records, setRecords] = useState<RegistryRecord[]>(modelRegistry.rows);
  const [form, setForm] = useState<RegistryRecord>({ name: '', version: 'v1.0', status: 'staging', lastTrained: new Date().toISOString().slice(0, 10) });
  const [editing, setEditing] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.name) return;
    if (editing) {
      setRecords((prev) => prev.map((record) => (record.name === editing ? form : record)));
    } else {
      setRecords((prev) => [...prev, form]);
    }
    setForm({ name: '', version: 'v1.0', status: 'staging', lastTrained: new Date().toISOString().slice(0, 10) });
    setEditing(null);
  };

  const handleEdit = (record: RegistryRecord) => {
    setForm(record);
    setEditing(record.name);
  };

  const handleDelete = (name: string) => {
    setRecords((prev) => prev.filter((record) => record.name !== name));
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>{modelRegistry.title}</h1>
          <p>{modelRegistry.description}</p>
        </div>
      </header>
      <section className="table-card">
        <h2>Model Bilgileri</h2>
        <div className="crud-form">
          <input value={form.name} placeholder="Model adı" onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input value={form.version} placeholder="Versiyon" onChange={(event) => setForm({ ...form, version: event.target.value })} />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            {['production', 'staging', 'archived'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input type="date" value={form.lastTrained} onChange={(event) => setForm({ ...form, lastTrained: event.target.value })} />
          <button onClick={handleSubmit}>{editing ? 'Güncelle' : 'Ekle'}</button>
        </div>
      </section>
      <section className="table-card">
        <h2>Model Listesi</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {modelRegistry.columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.name}>
                  <td>{record.name}</td>
                  <td>{record.version}</td>
                  <td>{record.status}</td>
                  <td>{record.lastTrained}</td>
                  <td className="table-actions">
                    <button className="ghost" onClick={() => handleEdit(record)}>
                      Düzenle
                    </button>
                    <button className="ghost" onClick={() => handleDelete(record.name)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ModelRegistry;
