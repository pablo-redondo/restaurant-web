'use client';

import { useEffect, useState } from 'react';
import { tablesApi } from '@/lib/api';
import type { Table } from '@/types';

const LEGEND = [
  { label: 'Disponible', dot: '#1A8A50', border: '#1A8A50', bg: 'rgba(13,146,84,0.04)' },
  { label: 'Inactiva',   dot: '#C4D5CA', border: '#C4D5CA', bg: 'transparent' },
];

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [newNumber,   setNewNumber]   = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [newLocation, setNewLocation] = useState<'interior' | 'terraza'>('interior');
  const [creating,    setCreating]    = useState(false);
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
        number:   Number(newNumber),
        capacity: Number(newCapacity),
        location: newLocation,
      });
      setTables(prev => [...prev, table]);
      setNewNumber('');
      setNewCapacity('');
    } catch (err: unknown) {
      const e = err as { error?: string };
      setCreateError(e?.error ?? 'Error al crear la mesa');
    } finally { setCreating(false); }
  };

  const toggleActive = async (table: Table) => {
    try {
      const { table: updated } = await tablesApi.update(table.id, { is_active: !table.is_active });
      setTables(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch { alert('Error al actualizar'); }
  };

  const interior = tables.filter(t => t.location === 'interior');
  const terraza  = tables.filter(t => t.location === 'terraza');

  const TableCard = ({ table }: { table: Table }) => {
    const available = table.is_active;
    const borderColor = available ? '#1A8A50'  : '#C4D5CA';
    const bgColor     = available ? 'rgba(13,146,84,0.04)' : 'transparent';
    const dotColor    = available ? '#1A8A50'  : '#C4D5CA';

    return (
      <div
        className={`rounded-card p-4 border transition-opacity ${!available ? 'opacity-50' : ''}`}
        style={{ borderColor, background: bgColor }}
      >
        <div className="flex items-start justify-between mb-2">
          <p className="font-heading font-bold text-[#172E22] text-base">Mesa {table.number}</p>
          <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: dotColor }} />
        </div>
        <p className="text-[#5A6B60] text-xs capitalize">{table.location}</p>
        <p className="text-[#5A6B60] text-xs">{table.capacity} pers.</p>
        <button
          onClick={() => toggleActive(table)}
          className="mt-3 w-full py-1.5 rounded-btn border border-[#C4D5CA] text-[#5A6B60] text-[11px] hover:border-[#172E22] hover:text-[#172E22] transition-colors"
        >
          {available ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex gap-4 mb-6">
        {LEGEND.map(({ label, dot }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-[#5A6B60]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: dot }} />
            {label}
          </div>
        ))}
      </div>

      {/* Create form */}
      <div className="bg-white border border-[#C4D5CA] rounded-card p-6 mb-8">
        <h3 className="font-heading font-bold text-[#172E22] text-lg mb-4">Nueva mesa</h3>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-[10px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-1 font-body">Número</label>
            <input type="number" min={1} required value={newNumber} onChange={e => setNewNumber(e.target.value)}
              className="w-24 border border-[#C4D5CA] rounded-btn px-3 py-2 text-[#172E22] text-sm focus:outline-none focus:border-[#172E22] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-1 font-body">Capacidad</label>
            <input type="number" min={1} max={20} required value={newCapacity} onChange={e => setNewCapacity(e.target.value)}
              className="w-24 border border-[#C4D5CA] rounded-btn px-3 py-2 text-[#172E22] text-sm focus:outline-none focus:border-[#172E22] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#5A6B60] uppercase tracking-[2px] mb-1 font-body">Zona</label>
            <select value={newLocation} onChange={e => setNewLocation(e.target.value as 'interior' | 'terraza')}
              className="border border-[#C4D5CA] rounded-btn px-3 py-2 text-[#172E22] text-sm focus:outline-none focus:border-[#172E22] transition-colors bg-white">
              <option value="interior">Interior</option>
              <option value="terraza">Terraza</option>
            </select>
          </div>
          <button type="submit" disabled={creating}
            className="px-5 py-2 rounded-btn bg-[#172E22] text-white font-semibold text-sm hover:bg-[#1A3D2D] disabled:opacity-50 transition-colors">
            {creating ? 'Creando...' : 'Crear mesa'}
          </button>
        </form>
        {createError && <p className="text-[#991B1B] text-sm mt-3">{createError}</p>}
      </div>

      {loading ? (
        <p className="text-[#5A6B60]">Cargando mesas...</p>
      ) : (
        <>
          {interior.length > 0 && (
            <div className="mb-8">
              <p className="text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2.5px] mb-3 font-body">Interior</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {interior.map(t => <TableCard key={t.id} table={t} />)}
              </div>
            </div>
          )}
          {terraza.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#5A6B60] uppercase tracking-[2.5px] mb-3 font-body">Terraza</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {terraza.map(t => <TableCard key={t.id} table={t} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
