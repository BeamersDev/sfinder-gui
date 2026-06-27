import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

interface SolutionTableProps {
  stdout: string;
  command: string;
}

interface SolutionRow {
  index: number;
  operations: string;
  percentage?: number;
  count?: number;
  fumen?: string;
}

export default function SolutionTable({ stdout, command }: SolutionTableProps) {
  const [search, setSearch] = useState('');
  const rows = useMemo(() => {
    const results: SolutionRow[] = [];
    const lines = stdout.split('\n');
    let idx = 0;

    for (const line of lines) {
      // Extract fumen from HTML <a href="...v115@..."> or raw v115@...
      const hrefMatch = line.match(/href="[^"]*v115@([\w?+/=%&@!*~.-]+)"/);
      const rawMatch = line.match(/v115@([\w?+/=%&@!*~.-]+)/);
      const fumenMatch = hrefMatch || rawMatch;
      const fumen = fumenMatch ? `v115@${fumenMatch[1]}` : undefined;
      // Pattern: "OP1 OP2 OP3 / XX.X % [NNN]"
      const opMatch = line.match(/([\w\-\s]+)\s*\/\s*(\d+\.?\d*)\s*%\s*\[(\d+)\]/);

      if (fumen || opMatch) {
        results.push({
          index: idx++,
          operations: opMatch ? opMatch[1].trim() : line.trim(),
          percentage: opMatch ? parseFloat(opMatch[2]) : undefined,
          count: opMatch ? parseInt(opMatch[3]) : undefined,
          fumen,
        });
      }
    }

    // Fallback: extract solution count
    if (results.length === 0) {
      const countMatch = stdout.match(/(\d+)\s+solutions/);
      if (countMatch) {
        results.push({
          index: 0,
          operations: `${countMatch[1]} solutions found`,
        });
      }
    }

    return results;
  }, [stdout]);

  const filtered = useMemo(
    () => search
      ? rows.filter((r) => r.operations.toLowerCase().includes(search.toLowerCase()))
      : rows,
    [rows, search],
  );

  const handleViewFumen = (fumen: string) => {
    const encoded = encodeURIComponent(fumen);
    new WebviewWindow(`fumen-${Date.now()}`, {
      url: `/view-fumen?fumen=${encoded}`,
      title: 'Fumen Viewer',
      width: 520,
      height: 780,
      resizable: true,
      center: true,
    });
  };

  if (rows.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs max-h-48 overflow-y-auto">{stdout}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter solutions..."
          className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs
            placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>

      <div className="text-xs text-muted-foreground">
        {filtered.length} solution{filtered.length !== 1 ? 's' : ''}
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8">#</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Operations</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground w-16">Rate</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground w-14">Count</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground w-16">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((row) => (
              <tr key={row.index} className="hover:bg-secondary/30 transition-colors">
                <td className="px-3 py-2 text-muted-foreground">{row.index + 1}</td>
                <td className="px-3 py-2 font-mono">
                  {row.fumen ? (
                    <span className="text-primary cursor-pointer hover:underline"
                      onClick={() => handleViewFumen(row.fumen!)}>
                      {row.operations || row.fumen.substring(0, 20) + '...'}
                    </span>
                  ) : row.operations}
                </td>
                <td className="px-3 py-2 text-right">
                  {row.percentage !== undefined ? (
                    <span className={row.percentage >= 80 ? 'text-green-400' : row.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                      {row.percentage.toFixed(1)}%
                    </span>
                  ) : '-'}
                </td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.count ?? '-'}</td>
                <td className="px-3 py-2 text-center">
                  {row.fumen && (
                    <button onClick={() => handleViewFumen(row.fumen!)}
                      className="text-[10px] px-2 py-0.5 rounded bg-primary/15 text-primary hover:bg-primary/25 transition-colors font-medium">
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
