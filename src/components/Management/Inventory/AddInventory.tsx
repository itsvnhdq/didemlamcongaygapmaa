import React, { useState } from "react";

interface InventoryItem {
  _id: string;
  bloodType: string;
  quantity: number;
  location: string;
  expirationDate: string;
  status: "available" | "reserved" | "used" | "expired";
  collectionDate: string;
}

interface AddInventoryForm {
  bloodType: string;
  quantity: number;
  location: string;
  expirationDate: string;
  collectionDate: string;
}

interface AddInventoryProps {
  onClose: () => void;
  onAdd: (newItem: InventoryItem) => void;
}

const AddInventory: React.FC<AddInventoryProps> = ({ onClose, onAdd }) => {
  const [addForm, setAddForm] = useState<AddInventoryForm>({
    bloodType: "",
    quantity: 0,
    location: "",
    expirationDate: "",
    collectionDate: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !addForm.bloodType ||
        !addForm.quantity ||
        !addForm.location ||
        !addForm.expirationDate
      ) {
        alert("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const newItem: InventoryItem = {
        _id: Date.now().toString(),
        bloodType: addForm.bloodType,
        quantity: addForm.quantity,
        location: addForm.location,
        expirationDate: new Date(addForm.expirationDate).toISOString(),
        status: "available",
        collectionDate: new Date(addForm.collectionDate).toISOString(),
      };

      onAdd(newItem);

      setAddForm({
        bloodType: "",
        quantity: 0,
        location: "",
        expirationDate: "",
        collectionDate: new Date().toISOString().split("T")[0],
      });

      setIsSubmitting(false);
      alert("Inventory added successfully!");
    } catch (error) {
      console.error("Error adding inventory:", error);
      alert("Failed to add inventory. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Add New Inventory
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleAddInventory} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Blood Type *
              </label>
              <select
                value={addForm.bloodType}
                onChange={(e) =>
                  setAddForm({ ...addForm, bloodType: e.target.value })
                }
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Quantity (units) *
              </label>
              <input
                type="number"
                min="1"
                value={addForm.quantity || ""}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Enter quantity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Storage Location *
              </label>
              <select
                value={addForm.location}
                onChange={(e) =>
                  setAddForm({ ...addForm, location: e.target.value })
                }
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                required
              >
                <option value="">Select Location</option>
                <option value="Storage Room A">Storage Room A</option>
                <option value="Storage Room B">Storage Room B</option>
                <option value="Storage Room C">Storage Room C</option>
                <option value="Emergency Storage">Emergency Storage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Collection Date *
              </label>
              <input
                type="date"
                value={addForm.collectionDate}
                onChange={(e) =>
                  setAddForm({ ...addForm, collectionDate: e.target.value })
                }
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Expiration Date *
              </label>
              <input
                type="date"
                value={addForm.expirationDate}
                onChange={(e) =>
                  setAddForm({ ...addForm, expirationDate: e.target.value })
                }
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  "Add Inventory"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;
