import React, { useState } from 'react';
import { Package, MapPin, Edit3, Check, X, AlertTriangle, Image } from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface InventoryCardProps {
  item: InventoryItem;
  onUpdateStock: (id: number, stock: number) => void;
  isUpdating: boolean;
}

export function InventoryCard({ item, onUpdateStock, isUpdating }: InventoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newStock, setNewStock] = useState(item.stock);

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { color: 'text-red-600', bg: 'bg-red-100', status: 'Crítico' };
    if (stock <= 20) return { color: 'text-yellow-600', bg: 'bg-yellow-100', status: 'Bajo' };
    return { color: 'text-green-600', bg: 'bg-green-100', status: 'Normal' };
  };

  const stockStatus = getStockStatus(item.stock);

  const handleSaveStock = () => {
    if (newStock !== item.stock) {
      onUpdateStock(item.id, newStock);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNewStock(item.stock);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      {item.foto && (
        <div className="mb-4">
          <img
            src={item.foto}
            alt={item.nombre}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${item.foto ? 'bg-blue-100' : 'bg-slate-100'}`}>
            {item.foto ? (
              <Image className="h-5 w-5 text-blue-600" />
            ) : (
              <Package className="h-5 w-5 text-slate-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{item.nombre}</h3>
            <div className="flex items-center space-x-1 text-sm text-slate-500 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{item.ubicacion}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
          {stockStatus.status}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-slate-500">Stock disponible</p>
            {isEditing ? (
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <button
                  onClick={handleSaveStock}
                  disabled={isUpdating}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-2xl font-bold text-slate-900">{item.stock}</p>
                <span className="text-sm text-slate-500">unidades</span>
              </div>
            )}
          </div>
          
          {item.stock <= 5 && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Reabastecer</span>
            </div>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Editar</span>
          </button>
        )}
      </div>
    </div>
  );
}