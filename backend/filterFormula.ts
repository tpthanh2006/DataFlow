function filterData(fields: Record<string, unknown> = {}): string {
  return Object.entries(fields)
    .map(([key, val]) => {
      if (typeof val === "string") {
        // Escape single quotes in strings
        const escapedVal = val.replace(/'/g, "\\'");
        return `{${key}} = '${escapedVal}'`;
      } else if (typeof val === "boolean" || typeof val === "number") {
        return `{${key}} = ${val}`;
      } else {
        return ""; // skip unsupported types
      }
    })
    .filter(Boolean) // remove empty strings
    .join(" AND ");
}

export { filterData };
