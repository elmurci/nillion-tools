import React, { useState } from 'react';
import { ArrowLeft, Upload, RefreshCw, Shield, Key, Lock, Database, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SelectableIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  selected: boolean;
}

interface ThresholdNumber {
  id: string;
  number: number;
  selected: boolean;
}
const SecretManager: React.FC = () => {
  const navigate = useNavigate();
  const [secret, setSecret] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRecreating, setIsRecreating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isSecretUploaded, setIsSecretUploaded] = useState(false);

  const [thresholdNumbers, setThresholdNumbers] = useState<ThresholdNumber[]>([
    { id: '1', number: 1, selected: false },
    { id: '2', number: 2, selected: false },
    { id: '3', number: 3, selected: true }, // Default selection
    { id: '4', number: 4, selected: false },
    { id: '5', number: 5, selected: false },
  ]);
  const [icons, setIcons] = useState<SelectableIcon[]>([
    { id: '1', name: 'Shield', icon: <Shield size={32} />, selected: false },
    { id: '2', name: 'Key', icon: <Key size={32} />, selected: false },
    { id: '3', name: 'Lock', icon: <Lock size={32} />, selected: false },
    { id: '4', name: 'Database', icon: <Database size={32} />, selected: false },
    { id: '5', name: 'Server', icon: <Server size={32} />, selected: false },
  ]);

  const selectedCount = icons.filter(icon => icon.selected).length;
  const selectedThreshold = thresholdNumbers.find(t => t.selected)?.number || 3;

  const selectThreshold = (id: string) => {
    setThresholdNumbers(prevNumbers => 
      prevNumbers.map(num => ({
        ...num,
        selected: num.id === id
      }))
    );
  };
  const toggleIcon = (id: string) => {
    if (!isSecretUploaded) return;
    
    setIcons(prevIcons => 
      prevIcons.map(icon => {
        if (icon.id === id) {
          // If trying to select and already at max (5), don't allow
          if (!icon.selected && selectedCount >= 5) {
            return icon;
          }
          return { ...icon, selected: !icon.selected };
        }
        return icon;
      })
    );
  };

  const handleUpload = async () => {
    if (!secret.trim()) {
      setUploadStatus('Please enter a secret to upload');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('Secret successfully uploaded to nilDB nodes');
      setIsSecretUploaded(true);
    } catch (error) {
      setUploadStatus('Failed to upload secret');
      setIsSecretUploaded(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecreateSecret = async () => {
    const selectedIcons = icons.filter(icon => icon.selected);
    
    if (selectedIcons.length < selectedThreshold) {
      setUploadStatus(`Please select at least ${selectedThreshold} nodes to recreate the secret`);
      return;
    }

    setIsRecreating(true);
    setUploadStatus(null);

    try {
      // Simulate secret recreation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus(`Secret recreated using ${selectedIcons.length} selected node${selectedIcons.length > 1 ? 's' : ''}`);
    } catch (error) {
      setUploadStatus('Failed to recreate secret');
    } finally {
      setIsRecreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-indigo-600 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 focus:ring-4 focus:ring-white/30 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20 transform hover:scale-105"
          >
            <ArrowLeft size={18} />
            Back 
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black/60 backdrop-blur-sm rounded-full mb-6">
            <img 
              src="/nillion-tools-logo.png" 
              alt="Logo" 
              className="logo"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Secret Manager</h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Upload secrets to nilDB nodes and recreate them using distributed storage.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          {/* Secret Input */}
          <div className="mb-8">
            <label htmlFor="secret-input" className="block text-lg font-semibold text-gray-800 mb-3">
              Secret
            </label>
            <textarea
              id="secret-input"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your secret here..."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-none font-mono text-sm shadow-inner bg-gray-50/50"
            />
          </div>

          {/* Threshold Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Minimum nodes required for recreation
            </h3>
            <div className="flex gap-3">
              {thresholdNumbers.map((threshold) => (
                <button
                  key={threshold.id}
                  onClick={() => selectThreshold(threshold.id)}
                  className={`w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-200 transform hover:scale-110 ${
                    threshold.selected
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white shadow-lg'
                      : 'bg-white/50 border-gray-300 text-gray-600 hover:bg-white/70 hover:border-gray-400'
                  }`}
                >
                  {threshold.number}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              Select the minimum number of nodes needed to recreate your secret
            </p>
          </div>
          {/* Upload Button */}
          <div className="mb-8">
            <button
              onClick={handleUpload}
              disabled={isUploading || !secret.trim()}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-3 justify-center"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload to nilDB nodes
                </>
              )}
            </button>
          </div>

          {/* Selectable Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Select nilDB Nodes ({selectedCount}/5)
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {icons.map((iconItem) => (
                <button
                  key={iconItem.id}
                  onClick={() => toggleIcon(iconItem.id)}
                  disabled={!isSecretUploaded || (!iconItem.selected && selectedCount >= 5)}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    !isSecretUploaded
                      ? 'bg-gray-200/50 border-gray-300 text-gray-400 cursor-not-allowed opacity-50'
                      : iconItem.selected
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white shadow-lg'
                      : 'bg-white/50 border-gray-300 text-gray-600 hover:bg-white/70 hover:border-gray-400'
                  } ${
                    (!iconItem.selected && selectedCount >= 5) || !isSecretUploaded
                      ? 'opacity-50 cursor-not-allowed hover:scale-100'
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {iconItem.icon}
                    <span className="text-xs font-medium">{iconItem.name}</span>
                  </div>
                  {iconItem.selected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {!isSecretUploaded 
                ? 'Upload a secret first to enable node selection'
                : `Select at least ${selectedThreshold} nilDB nodes to participate in secret recreation`
              }
            </p>
          </div>

          {/* Recreate Secret Button */}
          <div className="mb-6">
            <button
              onClick={handleRecreateSecret}
             disabled={isRecreating || selectedCount < selectedThreshold || !isSecretUploaded}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-3 justify-center"
            >
              {isRecreating ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Recreating...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Recreate secret
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {uploadStatus && (
            <div className={`p-4 rounded-xl border-2 ${
              uploadStatus.includes('successfully') || uploadStatus.includes('recreated')
                ? 'bg-green-50/90 border-green-200 text-green-800'
                : 'bg-red-50/90 border-red-200 text-red-800'
            }`}>
              <p className="font-medium">{uploadStatus}</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">How it works</h3>
          <div className="space-y-3 text-white/80">
            <p>• <strong>Upload:</strong> Your secret is securely distributed across multiple nilDB nodes using secret sharing</p>
            <p>• <strong>Select Nodes:</strong> Choose which nodes will participate in recreating your secret</p>
            <p>• <strong>Recreate:</strong> The selected nodes work together to reconstruct your original secret</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretManager;