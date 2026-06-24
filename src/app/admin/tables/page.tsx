'use client';

import { useEffect, useState } from 'react';
import { tablesApi } from '@/lib/api';
import type { Table } from '@/types';

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [newNumber, setNewNumber] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [newLocation, setNewLocation] = useState<'interior' | 'terraza'>('interior');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    tablesApi.list().then(({ tables }) => setTables(tables)).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      const { table } = await tablesApi.create({
        number: Number(newNumber),
        capacity: Number(newCapacity),
        location: newLocation,
      });
      setTables((prev) => [...prev, table]);
      setNewNumber('');
      setNewCapacity('');
    } catch (err: unknown) {
      const e = err as { error?: string };
      setCreateError(e?.error ?? 'Error al crear la mesa');
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (table: Table) => {
    try {
      const { table: updated } = await tablesApi.update(table.id, { is_active: !table.is_active });
      setTables((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    } catch {
      alert('Error al actualizar');
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Gestión de mesas</h2>

      {/* Create form */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 mb-8">
        <h3 className="font-serif text-lg mb-4">Nueva mesa</h3>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-stone-400 mb-1">Número</label>
            <input type="number" min={1} required value={newNumber} onChange={(e) => setNewNumber(e.target.value)}
              className="w-24 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Capacidad</label>
            <input type="number" min={1} max={20} required value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)}
              className="w-24 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Zona</label>
            <select value={newLocation} onChange={(e) => setNewLocation(e.target.value as 'interior' | 'terraza')}
              className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 transition-colors">
              <option value="interior">Interior</option>
              <option value="terraza">Terraza</option>
            </select>
          </div>
          <button type="submit" disabled={creating}
            className="px-5 py-2 bg-amber-500 text-stone-950 font-semibold rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-colors">
            {creating ? 'Creando...' : 'Crear mesa'}
          </button>
        </form>
        {createError && <p className="text-red-400 text-sm mt-3">{createError}</p>}
      </div>

      {/* Tables list */}
      {loading ? (
        <p className="text-stone-400">Cargando mesas...</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`rounded-xl border p-5 transition-opacity ${
                table.is_active ? 'border-stone-700 bg-stone-900' : 'border-stone-800 bg-stone-900/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="font-serif text-xl text-amber-400">Mesa {table.number}</p>
                <span className={`text-xs px-2 py-0.5 rounded border ${
                  table.is_active
                    ? 'border-emerald-700 text-emerald-400 bg-emerald-900/30'
                    : 'border-stone-700 text-stone-500'
                }`}>
                  {table.is_active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p className="text-stone-400 text-sm capitalize mb-1">{table.location}</p>
              <p className="text-stone-400 text-sm">{table.capacity} personas</p>
              <button
                onClick={() => toggleActive(table)}
                className="mt-4 w-full py-1.5 border border-stone-700 rounded text-stone-400 hover:border-stone-500 hover:text-stone-300 text-xs transition-colors"
              >
                {table.is_active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
