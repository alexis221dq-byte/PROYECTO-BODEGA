import { InventoryItem, NewInventoryItem } from '../types/inventory';

const API_BASE_URL = 'http://localhost:3000';

// Mock data for development (replace with real API calls)
const mockInventory: InventoryItem[] = [
  { id: 1, Tipo: "ERSA", nombre: "Tornillo M8", Cod_Material: "105197759", ubicacion: "Estante A1", stock: 120, foto: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 2, Tipo: "ERSA", nombre: "Tornillo M8", Cod_Material: "105197759", ubicacion: "Estante A1", stock: 120, foto: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 3, Tipo: "ERSA", nombre: "Tornillo M8", Cod_Material: "105197759", ubicacion: "Estante A1", stock: 120, foto: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 4, Tipo: "ERSA", nombre: "Tornillo M8", Cod_Material: "105197759", ubicacion: "Estante A1", stock: 120, foto: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 5, Tipo: "ERSA", nombre: "Tornillo M8", Cod_Material: "105197759", ubicacion: "Estante A1", stock: 120, foto: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 6, Tipo: "ERSA", nombre: "Tornillo M8", Cod_Material: "105197759", ubicacion: "Estante A1", stock: 120, foto: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

let currentInventory = [...mockInventory];

export const inventoryApi = {
  async getAll(): Promise<InventoryItem[]> {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return currentInventory;
  },

  async getById(id: number): Promise<InventoryItem | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return currentInventory.find(item => item.id === id) || null;
  },

  async create(item: NewInventoryItem): Promise<InventoryItem> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = currentInventory.length > 0 ? Math.max(...currentInventory.map(i => i.id)) : 0;
    const newItem: InventoryItem = {
      id: maxId + 1,
      ...item,
    };
    currentInventory.push(newItem);
    return newItem;
  },

  async createBulk(items: NewInventoryItem[]): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const maxId = currentInventory.length > 0 ? Math.max(...currentInventory.map(i => i.id)) : 0;
    const newItems: InventoryItem[] = items.map((item, index) => ({
      id: maxId + index + 1,
      ...item,
    }));
    currentInventory.push(...newItems);
    return newItems;
  },

  async updateStock(id: number, stock: number): Promise<InventoryItem | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const item = currentInventory.find(item => item.id === id);
    if (item) {
      item.stock = stock;
      return item;
    }
    return null;
  },

  // Real API calls (uncomment when backend is running)
  /*
  async getAll(): Promise<InventoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/inventario`);
    return response.json();
  },

  async getById(id: number): Promise<InventoryItem | null> {
    const response = await fetch(`${API_BASE_URL}/inventario/${id}`);
    if (response.status === 404) return null;
    return response.json();
  },

  async create(item: NewInventoryItem): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return response.json();
  },

  async updateStock(id: number, stock: number): Promise<InventoryItem | null> {
    const response = await fetch(`${API_BASE_URL}/inventario/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock }),
    });
    if (response.status === 404) return null;
    return response.json();
  },
  */
};