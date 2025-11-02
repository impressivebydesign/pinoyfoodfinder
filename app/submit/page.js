'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Send, CheckCircle, Utensils, Plus, X } from 'lucide-react';
import { US_STATES, CATEGORIES } from '@/lib/constants';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    website: '',
    category: 'restaurant',
    description: '',
    submitter_name: '',
    submitter_email: '',
  });

  const [signatureDishes, setSignatureDishes] = useState([
    { name: '', popular: false }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDishChange = (index, field, value) => {
    const newDishes = [...signatureDishes];
    newDishes[index][field] = value;
    setSignatureDishes(newDishes);
  };

  const addDish = () => {
    setSignatureDishes([...signatureDishes, { name: '', popular: false }]);
  };

  const removeDish = (index) => {
    if (signatureDishes.length > 1) {
      setSignatureDishes(signatureDishes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.name || !formData.city || !formData.state || !formData.submitter_name || !formData.submitter_email) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Filter out empty dishes
    const validDishes = signatureDishes.filter(dish => dish.name.trim() !== '');

    const submissionData = {
      restaurant_data: {
        ...formData,
        signature_dishes: validDishes,
        cuisine_tags: ['Filipino'],
        verified: false
      },
      submitter_name: formData.submitter_name,
      submitter_email: formData.submitter_email,
      status: 'pending'
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setLoading(false);
    }
  };

  const stats = { totalRestaurants: 0, totalStates: 50 };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
        <Header stats={stats} />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your submission has been received and will be reviewed shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '', address: '', city: '', state: '', zip_code: '',
                  phone: '', website: '', category: 'restaurant', description: '',
                  submitter_name: '', submitter_email: ''
                });
                setSignatureDishes([{ name: '', popular: false }]);
              }}
              className="bg-pinoy-red text-white px-6 py-3 rounded-lg hover:bg-pinoy-red/90 font-semibold"
            >
              Submit Another
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      <Header stats={stats} />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Add a Listing</h1>
          <p className="text-lg text-gray-600 mb-6">
            Know a great restaurant? Help grow our directory by submitting it here!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Info */}
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Business Name <span className="text-pinoy-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                    placeholder="e.g., Manila Kitchen, Tindahan Grocery, etc."
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                  >
                    {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                    placeholder="Brief description of the business"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      City <span className="text-pinoy-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      State <span className="text-pinoy-red">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                    >
                      <option value="">Select State</option>
                      {US_STATES.map(state => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specialty Dishes */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Utensils size={24} className="text-pinoy-red" />
                  Specialty Dishes
                </h2>
                <button
                  type="button"
                  onClick={addDish}
                  className="flex items-center gap-2 text-pinoy-red hover:text-pinoy-red/90 font-medium"
                >
                  <Plus size={20} />
                  Add Dish
                </button>
              </div>

              <div className="space-y-4">
                {signatureDishes.map((dish, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                    {signatureDishes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDish(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-pinoy-red"
                      >
                        <X size={20} />
                      </button>
                    )}
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={dish.name}
                        onChange={(e) => handleDishChange(index, 'name', e.target.value)}
                        placeholder="Dish name (e.g., Chicken Adobo)"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={dish.popular}
                          onChange={(e) => handleDishChange(index, 'popular', e.target.checked)}
                          className="w-4 h-4 text-pinoy-red"
                        />
                        <span className="text-sm text-gray-700">Mark as most popular dish</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submitter Info */}
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Your Name <span className="text-pinoy-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="submitter_name"
                    value={formData.submitter_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Your Email <span className="text-pinoy-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="submitter_email"
                    value={formData.submitter_email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pinoy-red focus:border-pinoy-red"
                    placeholder="We'll notify you when approved"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pinoy-red text-white py-4 rounded-lg hover:bg-pinoy-red/90 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send size={20} />
                  Submit Listing
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}