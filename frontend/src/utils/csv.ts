export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h];
      const str = val === null || val === undefined ? '' : String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function membersToCSVData(members: Record<string, unknown>[]): Record<string, unknown>[] {
  return members.map(m => ({
    'Member ID': m.memberId,
    'Age': m.age,
    'Sex': m.sex,
    'Community': m.communityName,
    'ZIP Code': m.zipCode,
    'Primary Condition': m.primaryCondition,
    'SDOH Score': m.sdohScore,
    'Risk Level': m.riskLevel,
    'Hospitalization Risk': m.hospitalizationRisk,
    'Enrollment Status': m.enrollmentStatus,
    'Last Updated': m.lastUpdated,
  }));
}
