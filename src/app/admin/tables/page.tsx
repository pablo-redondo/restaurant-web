'use client';

import { useEffect, useState } from 'react';
import { tablesApi } from '@/lib/api';
import type { Table } from '@/types';

type ZoneFilter = 'all' | 'interior' | 'terraza';

function TableCard({ table, onToggle }: { table: Table; onToggle: (t: Table) => void }) {
  const avl = table.is_active;
  return (
    <div
      className={`border rounded-[4px] p-3 text-center transition-opacity ${!avl ? 'opacity-60' : ''}`}
      style={{ borderColor: avl ? '#C4D5CA' : '#E2ECE6', background: avl ? 'white' : '#F8FAF8' }}
    >
      <div className="flex justify-end mb-1">
        <div className={`w-2 h-2 rounded-full ${avl ? 'bg-[#1A8A50]' : 'bg-[#C4D5CA]'}`} />
      </div>
      <div className="text-[10px] font-bold text-[#5A6B60] uppercase tracking-[0.5px] mb-2">Mesa {table.number}</div>
      <div className="w-7 h-7 border-2 border-[#C4D5CA] rounded-[3px] mx-auto mb-2" />
      <div className="text-[12px] font-bold text-[#172E22]">{table.capacity} personas</div>
      <div className="text-[11px] text-[#5A6B60] mt-0.5 capitalize">{table.location}</div>
      <button
        onClick={() => onToggle(table)}
        className="mt-3 w-full py-1 rounded-[2px] border border-[#C4D5CA] text-[10px] font-bold text-[#5A6B60] uppercase tracking-[0.5px] hover:border-[#172E22] hover:text-[#172E22] transition"
      >
        {avl ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  );
}

export default function AdminTablesPage() {
  const [tables,      setTables]      = useState<Table[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState<ZoneFilter>('all');
  const [showAdd,     setShowAdd]     = useState(false);
  const [newNumber,   setNewNumber]   = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [newLocation, setNewLocation] = useState<'interior' | 'terraza'>('interior');
  const [creating,    setCreating]    = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    tablesApi.list({ includeInactive: true })
      .then(({ tables }) => setTables(tables))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true); setCreateError('');
    try {
      const { table } = await tablesApi.create({
        number: Number(newNumber), capacity: Number(newCapacity), location: newLocation,
      });
      setTables(prev => [...prev, table]);
      setNewNumber(''); setNewCapacity(''); setShowAdd(false);
    } catch (err: unknown) {
      setCreateError((err as { error?: string })?.error ?? 'Error al crear la mesa');
    } finally { setCreating(false); }
  };

  const toggleActive = async (table: Table) => {
    try {
      const { table: updated } = await tablesApi.update(table.id, { is_active: !table.is_active });
      setTables(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch { alert('Error al actualizar'); }
  };

  const avlCount = tables.filter(t => t.is_active).length;
  const offCount = tables.filter(t => !t.is_active).length;

  const interior = tables.filter(t => t.location === 'interior' && (filter === 'all' || filter === 'interior'));
  const terraza  = tables.filter(t => t.location === 'terraza'  && (filter === 'all' || filter === 'terraza'));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4 text-[12px] text-[#5A6B60]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A8A50]" />
            Disponible ({avlCount})
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C4D5CA]" />
            Inactiva ({offCount})
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-[#C4D5CA] rounded-[3px] overflow-hidden text-[12px] font-bold">
            {(['all', 'interior', 'terraza'] as ZoneFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-[6px] border-r border-[#C4D5CA] last:border-r-0 transition-colors ${
                  filter === f ? 'bg-[#172E22] text-white' : 'bg-white text-[#5A6B60] hover:bg-[#F0F4F0]'
                }`}
              >
                {f === 'all' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="px-3 py-[6px] bg-[#172E22] text-white text-[12px] font-bold rounded-[3px] hover:bg-[#1A3D2D] transition"
          >
            + Añadir mesa
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white border border-[#C4D5CA] rounded-[4px] p-5 mb-4">
          <h3 className="text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-4">Nueva mesa</h3>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-[10px] font-bold text-[#5A6B60] uppercase tracking-[1.5px] mb-1">Número</label>
              <input type="number" min={1} required value={newNumber} onChange={e => setNewNumber(e.target.value)}
                className="w-24 border border-[#C4D5CA] rounded-[3px] px-3 py-2 text-[#172E22] text-sm outline-none focus:border-[#172E22]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#5A6B60] uppercase tracking-[1.5px] mb-1">Capacidad</label>
              <input type="number" min={1} max={20} required value={newCapacity} onChange={e => setNewCapacity(e.target.value)}
                className="w-24 border border-[#C4D5CA] rounded-[3px] px-3 py-2 text-[#172E22] text-sm outline-none focus:border-[#172E22]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#5A6B60] uppercase tracking-[1.5px] mb-1">Zona</label>
              <select value={newLocation} onChange={e => setNewLocation(e.target.value as 'interior' | 'terraza')}
                className="border border-[#C4D5CA] rounded-[3px] px-3 py-2 text-[#172E22] text-sm bg-white outline-none">
                <option value="interior">Interior</option>
                <option value="terraza">Terraza</option>
              </select>
            </div>
            <button type="submit" disabled={creating}
              className="px-4 py-2 bg-[#172E22] text-white text-[13px] font-bold rounded-[3px] disabled:opacity-50 hover:bg-[#1A3D2D] transition">
              {creating ? 'Creando...' : 'Crear'}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="px-4 py-2 border border-[#C4D5CA] text-[#5A6B60] text-[13px] rounded-[3px] hover:border-[#172E22] hover:text-[#172E22] transition">
              Cancelar
            </button>
          </form>
          {createError && <p className="text-[#991B1B] text-sm mt-2">{createError}</p>}
        </div>
      )}

      {loading ? (
        <p className="text-[#5A6B60] text-sm">Cargando mesas...</p>
      ) : (
        <>
          {interior.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-bold text-[#172E22] uppercase tracking-[2.5px] pb-2 mb-3 border-b border-[#E2ECE6]">Interior</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {interior.map(t => <TableCard key={t.id} table={t} onToggle={toggleActive} />)}
              </div>
            </div>
          )}
          {terraza.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#172E22] uppercase tracking-[2.5px] pb-2 mb-3 border-b border-[#E2ECE6]">Terraza</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {terraza.map(t => <TableCard key={t.id} table={t} onToggle={toggleActive} />)}
              </div>
            </div>
          )}
          {interior.length === 0 && terraza.length === 0 && (
            <p className="text-[#5A6B60] text-sm text-center py-8">No hay mesas para mostrar.</p>
          )}
        </>
      )}
    </div>
  );
}
