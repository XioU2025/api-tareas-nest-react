import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  async function loadTasks() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(`No se pudieron cargar las tareas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function clearForm() {
    setForm({ title: '', description: '' });
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const isEditing = editingId !== null;
      const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = response.status === 204 ? null : await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}`);
      }

      if (isEditing) {
        setTasks((current) =>
          current.map((task) => (task.id === data.id ? data : task))
        );
        setMessage('Tarea actualizada correctamente.');
      } else {
        setTasks((current) => [...current, data]);
        setMessage('Tarea creada correctamente.');
      }

      clearForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || '',
    });
    setMessage('');
    setError('');
  }

  async function toggleCompleted(task) {
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}`);
      }

      setTasks((current) =>
        current.map((item) => (item.id === data.id ? data : item))
      );
      setMessage('Estado actualizado.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeTask(id) {
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || `Error ${response.status}`);
      }

      setTasks((current) => current.filter((task) => task.id !== id));
      setMessage('Tarea eliminada correctamente.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Gestor de Tareas</h1>
        <p>React consume una API HTTP creada con NestJS.</p>
      </header>

      <section className="card">
        <h2>{editingId ? 'Editar tarea' : 'Nueva tarea'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Título (mínimo 3 caracteres)"
            minLength={3}
            maxLength={80}
            required
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Descripción (opcional)"
            maxLength={200}
          />

          <div className="actions">
            <button disabled={saving}>
              {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear tarea'}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={clearForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <section className="card">
        <div className="list-header">
          <h2>Tareas</h2>
          <button className="secondary" onClick={loadTasks}>Actualizar</button>
        </div>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p>No hay tareas.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task" key={task.id}>
                <div>
                  <h3 className={task.completed ? 'completed' : ''}>
                    {task.title}
                  </h3>
                  <p>{task.description || 'Sin descripción'}</p>
                  <small>ID: {task.id} · {task.completed ? 'Completada' : 'Pendiente'}</small>
                </div>

                <div className="task-actions">
                  <button onClick={() => toggleCompleted(task)}>
                    {task.completed ? 'Marcar pendiente' : 'Completar'}
                  </button>
                  <button className="secondary" onClick={() => startEdit(task)}>
                    Editar
                  </button>
                  <button className="danger" onClick={() => removeTask(task.id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>
        <a href="http://localhost:3000/api/docs" target="_blank">
          Abrir documentación OpenAPI
        </a>
      </footer>
    </main>
  );
}

export default App;
