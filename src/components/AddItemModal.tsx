import React, { useState } from 'react';
import { X, Plus, Package, Upload, Image } from 'lucide-react';
import { NewInventoryItem } from '../types/inventory';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: NewInventoryItem) => void;
  isAdding: boolean;
}

export function AddItemModal({ isOpen, onClose, onAdd, isAdding }: AddItemModalProps) {
  const [formData, setFormData] = useState<NewInventoryItem>({
    Tipo: '',
    nombre: '',
    codigo: '',
    ubicacion: '',
    stock: 0.0,
    foto: '',
  });

  const [errors, setErrors] = useState<Partial<NewInventoryItem>>({});
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<NewInventoryItem> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }
    
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd(formData);
      setFormData({ Tipo: '', nombre: '', codigo: '', ubicacion: '', stock: 0, foto: '' });
      setErrors({});
      setPreviewImage('');
    }
  };

  const handleInputChange = (field: keyof NewInventoryItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        handleInputChange('foto', result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage('');
    handleInputChange('foto', '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Agregar Material</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
              Tipo 
            </label>
            <input
              type="text"
              id="Tipo"
              value={formData.Tipo}
              onChange={(e) => handleInputChange('Tipo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.nombre ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: ERSA"
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.Tipo}</p>}
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
              Texto breve material 
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.nombre ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: Tornillo M10"
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-slate-700 mb-2">
              codigo
            </label>
            <input
              type="number"
              id="codigo"
              value={formData.stock}
              onChange={(e) => handleInputChange('codigo', parseInt(e.target.value) || 0)}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.stock ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
          
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-2">
              Stock Inicial
            </label>
            <input
              type="number"
              id="stock"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.stock ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>

          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-slate-700 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              id="ubicacion"
              value={formData.ubicacion}
              onChange={(e) => handleInputChange('ubicacion', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.ubicacion ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Ej: Estante A1"
            />
            {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Foto del Material (Opcional)
            </label>
            
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Vista previa"
                  className="w-full h-32 object-cover rounded-lg border border-slate-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <Upload className="h-8 w-8 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-600">
                    {isUploading ? 'Cargando...' : 'Haz clic para subir una foto'}
                  </span>
                  <span className="text-xs text-slate-500">PNG, JPG hasta 10MB</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Agregando...</span>
                </>
              ) : (
                <>
                  <Package className="h-4 w-4" />
                  <span>Agregar Material</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}