import { useState, useEffect } from 'react';
import api from '../api/axios';

const MyTodos = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);
    const [todoError, setTodoError] = useState('');

    useEffect(() => {
        api.get('/todos')
            .then(res => { setTodos(Array.isArray(res.data) ? res.data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const showError = (msg) => {
        setTodoError(msg);
        setTimeout(() => setTodoError(''), 3000);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        try {
            const res = await api.post('/todos', { task: newTask.trim() });
            setTodos([res.data, ...todos]);
            setNewTask('');
        } catch (err) {
            showError(err.response?.data?.message || 'Error adding todo');
        }
    };

    const handleToggle = async (id) => {
        try {
            const res = await api.patch(`/todos/${id}/toggle`);
            setTodos(todos.map(t => t.id === id ? res.data : t));
        } catch (err) {
            showError('Error updating todo');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            showError('Error deleting todo');
        }
    };

    if (loading) return <p>Loading todos...</p>;

    return (
        <div className="todos-container">
            <form className="todo-add-form" onSubmit={handleAdd}>
                <input
                    type="text"
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button type="submit" className="btn-hire">Add</button>
            </form>
            {todoError && <p className="inline-error">{todoError}</p>}

            {todos.length === 0 ? (
                <p className="todos-empty">No tasks yet. Add one above!</p>
            ) : (
                <ul className="todo-list">
                    {todos.map(todo => (
                        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggle(todo.id)}
                                className="todo-checkbox"
                            />
                            <span className="todo-task">{todo.task}</span>
                            <button className="todo-delete" onClick={() => handleDelete(todo.id)}>✕</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyTodos;
