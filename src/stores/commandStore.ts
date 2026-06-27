import { create } from 'zustand';
import type {
  SfinderCommandConfig,
  SfinderOutput,
  CommandStatus,
  CommandHistoryEntry,
} from '@/types/sfinder';

interface CommandStore {
  currentCommand: SfinderCommandConfig | null;
  status: CommandStatus;
  recentCommands: CommandHistoryEntry[];

  setRunning: (config: SfinderCommandConfig) => void;
  setSuccess: (output: SfinderOutput) => void;
  setError: (message: string, stderr?: string) => void;
  setCancelled: () => void;
  clearStatus: () => void;
  clearHistory: () => void;
}

export const useCommandStore = create<CommandStore>((set, get) => ({
  currentCommand: null,
  status: { type: 'idle' },
  recentCommands: [],

  setRunning: (config) =>
    set({
      currentCommand: config,
      status: { type: 'running', startTime: Date.now() },
    }),

  setSuccess: (output) => {
    const { currentCommand } = get();
    if (!currentCommand) return;
    const entry: CommandHistoryEntry = {
      id: crypto.randomUUID(),
      config: currentCommand,
      output,
      timestamp: Date.now(),
    };
    set((s) => ({
      status: { type: 'success', output },
      recentCommands: [entry, ...s.recentCommands].slice(0, 50),
    }));
  },

  setError: (message, stderr) =>
    set({ status: { type: 'error', message, stderr } }),

  setCancelled: () => set({ status: { type: 'cancelled' } }),

  clearStatus: () => set({ status: { type: 'idle' }, currentCommand: null }),
  clearHistory: () => set({ recentCommands: [] }),
}));
