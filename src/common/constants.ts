export enum ColumnType {
  Text = 'text',
  Number = 'number',
  Percentage = 'percentage',
}

export const apiUrl = process.env.NODE_ENV !== "production" ? "http://localhost:3001/api" : "deployedUrl";
export const LOCAL_STORAGE_AUTH = "auth";