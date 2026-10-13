const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/game';

export const chessApi = {
  async getState() {
    const res = await fetch(`${API_BASE}/state`);
    if (!res.ok) throw new Error(`Failed to fetch state: ${res.statusText}`);
    return res.json();
  },

  async makeMove(uci) {
    const res = await fetch(`${API_BASE}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uci }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid move' }));
      throw new Error(err.detail || 'Illegal move');
    }
    return res.json();
  },

  async makeAIMove() {
    const res = await fetch(`${API_BASE}/ai-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'AI move failed' }));
      throw new Error(err.detail || 'AI move failed');
    }
    return res.json();
  },

  async getHint() {
    const res = await fetch(`${API_BASE}/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate hint' }));
      throw new Error(err.detail || 'Failed to generate hint');
    }
    return res.json();
  },

  async resetGame() {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error('Reset failed');
    return res.json();
  },

  async undoMove() {
    const res = await fetch(`${API_BASE}/undo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Undo failed');
    return res.json();
  },
};
