async function fetchTableColumnNames(tableName: string): Promise<string[]> {
  const response = await fetch(
    `http://localhost:3000/table/table-column-names/${tableName}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch table column names');
  }

  const {
    status,
    data,
  }: {
    status: string;
    data: string[];
    error: { message: string };
  } = await response.json();

  if (status === 'error') {
    throw new Error('Failed to fetch table column names');
  }

  return data;
}

export { fetchTableColumnNames };
