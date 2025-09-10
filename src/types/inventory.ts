export interface InventoryItem {
  id: number;
  nombre: string;
  stock: number;
  ubicacion: string;
  foto?: string;
}

export interface NewInventoryItem {
  nombre: string;
  stock: number;
  ubicacion: string;
  foto?: string;
}