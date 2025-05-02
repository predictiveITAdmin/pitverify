export const exportToCSV = ({ data, fileName = 'export', headers }) => {
  if (!data || !data.length) {
    console.error('No data found');
    return;
  };

  const fieldNames = headers || Object.keys(data[0]);

  const csvRows = data.map(row =>
    fieldNames.map(field => {
      const value = row[field] ?? '';
      // Escape quotes by doubling them
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvString = [fieldNames.map(h => `"${h}"`).join(','), ...csvRows].join('\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};