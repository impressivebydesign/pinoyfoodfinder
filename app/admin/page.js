'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Trash2, Loader } from 'lucide-react';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'pinoy2025') {
      setAuthenticated(true);
      fetchSubmissions();
    } else {
      alert('Incorrect password');
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/submissions?status=${filter}`);
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions();
    }
  }, [filter, authenticated]);

  const handleApprove = async (submission) => {
    if (!confirm('Approve this restaurant?')) return;

    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submission.id, data: submission.restaurant_data })
      });

      if (response.ok) {
        alert('Restaurant approved and added to directory!');
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      alert('Error approving submission');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this submission?')) return;

    try {
      const response = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        alert('Submission rejected');
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      alert('Error rejecting submission');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission permanently?')) return;

    try {
      const response = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        alert('Submission deleted');
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      alert('Error deleting submission');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Restaurant Submissions</h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-lg font-semibold ${
                filter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-6 py-2 rounded-lg font-semibold ${
                filter === 'approved' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-6 py-2 rounded-lg font-semibold ${
                filter === 'rejected' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rejected
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin" size={40} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No {filter} submissions
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <h3 className="font-bold text-lg mb-2">{submission.restaurant_data.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {submission.restaurant_data.city}, {submission.restaurant_data.state}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Submitted: {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm font-semibold"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    {filter === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(submission)}
                          className="flex items-center justify-center bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleReject(submission.id)}
                          className="flex items-center justify-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(submission.id)}
                      className="flex items-center justify-center bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedSubmission.restaurant_data.name}</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4 text-gray-800">
                <div>
                  <span className="font-semibold text-gray-900">Category:</span> {selectedSubmission.restaurant_data.category}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Address:</span> {selectedSubmission.restaurant_data.address}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">City, State:</span> {selectedSubmission.restaurant_data.city}, {selectedSubmission.restaurant_data.state}
                </div>
                {selectedSubmission.restaurant_data.phone && (
                  <div>
                    <span className="font-semibold text-gray-900">Phone:</span> {selectedSubmission.restaurant_data.phone}
                  </div>
                )}
                {selectedSubmission.restaurant_data.website && (
                  <div>
                    <span className="font-semibold text-gray-900">Website:</span>{' '}
                    <a href={selectedSubmission.restaurant_data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedSubmission.restaurant_data.website}
                    </a>
                  </div>
                )}
                {selectedSubmission.restaurant_data.description && (
                  <div>
                    <span className="font-semibold text-gray-900">Description:</span>
                    <p className="mt-1 text-gray-700">{selectedSubmission.restaurant_data.description}</p>
                  </div>
                )}

                {selectedSubmission.restaurant_data.signature_dishes?.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">Signature Dishes:</span>
                    <div className="mt-2 space-y-2">
                      {selectedSubmission.restaurant_data.signature_dishes.map((dish, i) => (
                        <div key={i} className="bg-amber-50 p-3 rounded-lg">
                          <div className="font-semibold text-gray-900">{dish.name} {dish.popular && '🔥'}</div>
                          <div className="text-sm text-gray-700">{dish.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.submitter_name && (
                  <div>
                    <span className="font-semibold text-gray-900">Submitted by:</span>{' '}
                    <span className="text-gray-700">{selectedSubmission.submitter_name}</span>
                    {selectedSubmission.submitter_email && ` (${selectedSubmission.submitter_email})`}
                  </div>
                )}
              </div>

              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleApprove(selectedSubmission)}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedSubmission.id)}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}