export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: string; header: string }[]
) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = columns 
    ? columns.map(col => col.header)
    : Object.keys(data[0]);

  const keys = columns
    ? columns.map(col => col.key)
    : Object.keys(data[0]);

  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        const stringValue = value === null || value === undefined ? '' : String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON<T extends Record<string, any>>(
  data: T[],
  filename: string
) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToClipboard<T extends Record<string, any>>(
  data: T[],
  columns?: { key: string; header: string }[]
) {
  const headers = columns 
    ? columns.map(col => col.header)
    : Object.keys(data[0] || {});

  const keys = columns
    ? columns.map(col => col.key)
    : Object.keys(data[0] || {});

  const text = [
    headers.join('\t'),
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        return value === null || value === undefined ? '' : String(value);
      }).join('\t')
    )
  ].join('\n');

  navigator.clipboard.writeText(text);
}

interface ExportOptions {
  filename?: string;
  columns?: { key: string; header: string }[];
}

export function useExport<T extends Record<string, any>>() {
  const exportCSV = (data: T[], options: ExportOptions = {}) => {
    exportToCSV(data, options.filename || 'export', options.columns);
  };

  const exportJSON = (data: T[], options: ExportOptions = {}) => {
    exportToJSON(data, options.filename || 'export');
  };

  const exportClipboard = (data: T[], options: ExportOptions = {}) => {
    exportToClipboard(data, options.columns);
  };

  return { exportCSV, exportJSON, exportClipboard };
}
