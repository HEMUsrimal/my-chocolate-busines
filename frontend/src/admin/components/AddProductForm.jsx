import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AddProductForm = ({ onSuccess, product }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const UPLOAD_ENDPOINT = `${API_BASE_URL}/api/admin/upload`;

  const isEditMode = !!product;

  const userString = localStorage.getItem('user');
  const loggedInUser = userString ? JSON.parse(userString) : null;
  const isSeller = loggedInUser?.isSeller && !loggedInUser?.isAdmin;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Dark Chocolate',
    stock: '',
    images: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price !== undefined ? product.price.toString() : '',
        description: product.description || '',
        category: product.category || 'Dark Chocolate',
        stock: product.stock !== undefined ? product.stock.toString() : '',
        images: product.images || []
      });
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'Dark Chocolate',
        stock: '',
        images: []
      });
    }
    setSelectedFiles([]);
  }, [product]);

  const categories = [
    'Dark Chocolate',
    'Milk Chocolate',
    'White Chocolate',
    'Nut Chocolate',
    'Gift Box'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: imageUrls
    }));
  };

  const uploadImages = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        console.log('Uploading file:', file.name);
        const response = await axios.post(UPLOAD_ENDPOINT, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Upload response:', response.data);
        
        const imageUrl = response.data.url || response.data.imageUrl;
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        } else {
          console.error('Invalid response format:', response.data);
          throw new Error('Server response missing image URL');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload ${file.name}: ${error.response?.data?.message || error.message}`);
        throw error;
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditMode && selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    
    setLoading(true);
    try {
      let finalImageUrls = [...formData.images];
      
      if (selectedFiles.length > 0) {
        console.log('Starting image uploads...');
        const uploadedImageUrls = await uploadImages(selectedFiles);
        finalImageUrls = isEditMode 
          ? [...formData.images.filter(img => !img.startsWith('blob:')), ...uploadedImageUrls] 
          : uploadedImageUrls;
      }
      
      const payload = {
        name: formData.name,
        price: isSeller ? parseFloat(product?.price || 0) : parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        countInStock: parseInt(formData.stock),
        image: finalImageUrls[0] || '/images/default.jpg',
        images: finalImageUrls
      };

      if (isEditMode) {
        await updateProduct(product._id, payload);
        toast.success('Product updated successfully');
      } else {
        await createProduct(payload);
        toast.success('Product added successfully');
      }
      
      onSuccess?.();
      if (!isEditMode) {
        setFormData({
          name: '',
          price: '',
          description: '',
          category: 'Dark Chocolate',
          stock: '',
          images: []
        });
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
        {isEditMode ? 'Edit Product Details' : 'Add New Product'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product name"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) {isSeller && <span className="text-[10px] text-gray-400 font-normal">(Admin only)</span>}
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            disabled={isSeller}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter stock quantity"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {formData.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading 
          ? (isEditMode ? 'Updating Product...' : 'Adding Product...') 
          : (isEditMode ? 'Update Product' : 'Add Product')}
      </button>
    </form>
  );
};

export default AddProductForm;