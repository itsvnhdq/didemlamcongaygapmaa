import React, { useState } from 'react';

interface InventoryItem {
  _id: string;
  bloodType: string;
  quantity: number;
  location: string;
  expirationDate: string;
  status: 'available' | 'reserved' | 'used' | 'expired';
  collectionDate: string;
}

interface InventoryManagementProps {
  inventory: InventoryItem[];
  onClose: () => void;
  onUpdate: (updatedInventory: InventoryItem[]) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  inventory,
  onClose,
  onUpdate
}) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getBloodTypeColor = (bloodType: string): string => {
    switch (bloodType) {
      case 'A+': return 'bg-red-500';
      case 'A-': return 'bg-red-400';
      case 'B+': return 'bg-blue-500';
      case 'B-': return 'bg-blue-400';
      case 'AB+': return 'bg-purple-500';
      case 'AB-': return 'bg-purple-400';
      case 'O+': return 'bg-green-500';
      case 'O-': return 'bg-green-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'reserved': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredInventory = inventory.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  const handleEdit = (item: InventoryItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const updatedInventory = inventory.map(item =>
      item._id === editingItem._id ? editingItem : item
    );
    
    onUpdate(updatedInventory);
    setEditingItem(null);
  };

  const handleStatusChange = (itemId: string, newStatus: string) => {
    const updatedInventory = inventory.map(item =>
      item._id === itemId ? { ...item, status: newStatus as any } : item
    );
    onUpdate(updatedInventory);
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      const updatedInventory = inventory.filter(item => item._id !== itemId);
      onUpdate(updatedInventory);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Inventory Management</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="expired">Expired</option>
              </select>
              <div className="flex rounded-xl border-2 border-gray-300 overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 text-sm font-semibold transition-all ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  List View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <div key={item._id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 ${getBloodTypeColor(item.bloodType)} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {item.bloodType}
                    </div>
                    <span className={`px-3 py-2 text-xs font-bold rounded-full border-2 ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{item.quantity} units</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                  <p className="text-sm text-gray-600 mb-4">Expires: {new Date(item.expirationDate).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-3 py-2 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      Edit
                    </button>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-500"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="expired">Expired</option>
                    </select>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-2 text-sm font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expiration</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${getBloodTypeColor(item.bloodType)} rounded-xl flex items-center justify-center text-white text-sm font-bold mr-4 shadow-md`}>
                            {item.bloodType}
                          </div>
                          <span className="font-semibold text-gray-900">{item.bloodType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {item.quantity} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className="px-3 py-1 text-xs font-bold rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="expired">Expired</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {new Date(item.expirationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-800 font-semibold hover:underline transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Edit Inventory Item</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={editingItem.quantity}
                      onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value) || 0})}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                    <select
                      value={editingItem.location}
                      onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Storage Room A">Storage Room A</option>
                      <option value="Storage Room B">Storage Room B</option>
                      <option value="Storage Room C">Storage Room C</option>
                      <option value="Emergency Storage">Emergency Storage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiration Date</label>
                    <input
                      type="date"
                      value={editingItem.expirationDate.split('T')[0]}
                      onChange={(e) => setEditingItem({...editingItem, expirationDate: new Date(e.target.value).toISOString()})}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
