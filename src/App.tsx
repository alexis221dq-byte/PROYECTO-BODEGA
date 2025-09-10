import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { Layout } from './components/Layout';
import { InventoryCard } from './components/InventoryCard';
import { AddItemModal } from './components/AddItemModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { SearchBar } from './components/SearchBar';
import { StatsGrid } from './components/StatsGrid';
import { InventoryItem, NewInventoryItem } from './types/inventory';
import { inventoryApi } from './services/api';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'critical'>('all');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (newItem: NewInventoryItem) => {
    try {
      setIsAdding(true);
      const addedItem = await inventoryApi.create(newItem);
      // Reload the entire inventory to ensure consistency
      await loadInventory();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleImportItems = async (newItems: NewInventoryItem[]) => {
    try {
      setIsImporting(true);
      await inventoryApi.createBulk(newItems);
      await loadInventory();
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Error importing items:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleUpdateStock = async (id: number, stock: number) => {
    try {
      setUpdatingItems(prev => new Set([...prev, id]));
      const updatedItem = await inventoryApi.updateStock(id, stock);
      if (updatedItem) {
        setItems(prev => prev.map(item => 
          item.id === id ? updatedItem : item
        ));
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && item.stock <= 20) ||
      (stockFilter === 'critical' && item.stock <= 5);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Inventario Industrial</h2>
            <p className="text-slate-600">Gestión completa de materiales y suministros</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Importar Excel</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Material</span>
            </button>
          </div>
        </div>

        <StatsGrid items={items} />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          stockFilter={stockFilter}
          onFilterChange={setStockFilter}
        />

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <div className="max-w-sm mx-auto">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Plus className="h-8 w-8 text-slate-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchTerm || stockFilter !== 'all' ? 'No se encontraron materiales' : 'No hay materiales'}
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || stockFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer material al inventario'
                }
              </p>
              {!searchTerm && stockFilter === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Material</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <InventoryCard
                key={item.id}
                item={item}
                onUpdateStock={handleUpdateStock}
                isUpdating={updatingItems.has(item.id)}
              />
            ))}
          </div>
        )}

        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
          isAdding={isAdding}
        />

        <ImportExcelModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportItems}
          isImporting={isImporting}
        />
      </div>
    </Layout>
  );
}

export default App;