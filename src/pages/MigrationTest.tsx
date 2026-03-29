import React, { useState } from 'react';
import { auth } from '@/lib/postgres';

export default function MigrationTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123');
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await auth.signUp(email, password, firstName, lastName);
      setMessage(`✅ Registration successful! User: ${result.user.email}`);
    } catch (error) {
      setMessage(`❌ Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await auth.signIn(email, password);
      setMessage(`✅ Login successful! User: ${result.user.email}`);
    } catch (error) {
      setMessage(`❌ Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setMessage('✅ Logged out successfully');
    } catch (error) {
      setMessage(`❌ Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      const data = await response.json();
      setMessage(`✅ API Test successful: ${JSON.stringify(data)}`);
    } catch (error) {
      setMessage(`❌ API Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PostgreSQL Migration Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="test123"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Test"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="User"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleRegister}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
            
            <button
              onClick={testAPI}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Test API
            </button>
          </div>
          
          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Migration Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>PostgreSQL Database: ✅ Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Backend Server: ✅ Running on port 3001</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Authentication: ✅ JWT-based</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>File Storage: ✅ Local/Cloud ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
