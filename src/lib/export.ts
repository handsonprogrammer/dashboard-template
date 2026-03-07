import Papa from "papaparse";

/**
 * Export an array of objects to a CSV file download.
 *
 * @param data     Array of row objects.
 * @param filename Target filename (without extension).
 * @param columns  Optional allow-list of column keys to include.
 *                 When omitted, all keys in the first row are used.
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: (keyof T)[]
): void {
  if (data.length === 0) return;

  const rows: Record<string, unknown>[] = columns
    ? data.map((row) =>
        Object.fromEntries(columns.map((col) => [col, row[col]]))
      )
    : (data as Record<string, unknown>[]);

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
