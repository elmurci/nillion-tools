import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

interface NodeCardProps {
  nodeId: number;
  share: string;
  onShareChange: (nodeIdx: number, newValue: string) => void;
  isStored: boolean;
  isMalicious: boolean;
  isClean: boolean;
  successCount?: number;
  failCount?: number;
}

interface CombinationResult {
  nodes: number[];
  result: string;
  isValid: boolean;
}

interface EncryptResponse {
  shares: string[];
  runtime: string;
  error?: string;
}

interface DecryptResponse {
  decrypted: string;
  runtime: string;
  error?: string;
}

const NodeCard = ({ nodeId, share, onShareChange, isStored, isMalicious, isClean, successCount, failCount }: NodeCardProps) => {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
      isMalicious 
        ? 'border-red-400 bg-red-50' 
        : isClean
          ? 'border-green-400 bg-green-50'
          : isStored 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isMalicious ? 'bg-red-500' : isClean ? 'bg-green-500' : isStored ? 'bg-blue-500' : 'bg-gray-300'
          }`} />
          <span className="font-semibold text-gray-700">Node {nodeId}</span>
        </div>
        {isMalicious && (
          <span className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded-full">
            Malicious!
          </span>
        )}
        {isClean && (
          <span className="text-xs px-2 py-1 bg-green-200 text-green-700 rounded-full">
            Verified
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-1">Share (base64):</div>
      <textarea
        value={share}
        onChange={(e) => onShareChange(nodeId - 1, e.target.value)}
        className={`w-full font-mono text-xs p-2 rounded border resize-none h-16 ${
          isMalicious ? 'border-red-300 bg-red-100' : 'border-gray-300 bg-white'
        }`}
        placeholder="No share"
        disabled={!isStored}
      />
      {successCount !== undefined && failCount !== undefined && (
        <div className="mt-2 text-xs text-gray-500">
          Success: {successCount} | Fail: {failCount}
        </div>
      )}
    </div>
  );
};

const getCombinations = (n: number, k: number): number[][] => {
  const result: number[][] = [];
  const combine = (start: number, combo: number[]): void => {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < n; i++) {
      combo.push(i);
      combine(i + 1, combo);
      combo.pop();
    }
  };
  combine(0, []);
  return result;
};

export default function SecretSharingDemo() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState<string>('');
  const [nodeCount, setNodeCount] = useState<number>(4);
  const [threshold, setThreshold] = useState<number>(3);
  const [shares, setShares] = useState<string[]>([]);
  const [originalShares, setOriginalShares] = useState<string[]>([]);
  const [reconstructed, setReconstructed] = useState<string | null>(null);
  const [isStored, setIsStored] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [maliciousNodes, setMaliciousNodes] = useState<number[]>([]);
  const [nodeSuccessCount, setNodeSuccessCount] = useState<number[]>([]);
  const [nodeFailCount, setNodeFailCount] = useState<number[]>([]);
  const [combinationResults, setCombinationResults] = useState<CombinationResult[]>([]);
  const [validReconstruction, setValidReconstruction] = useState<string | null>(null);
  const [validNodes, setValidNodes] = useState<number[] | null>(null);

  const resetDetection = (): void => {
    setMaliciousNodes([]);
    setNodeSuccessCount([]);
    setNodeFailCount([]);
    setCombinationResults([]);
    setValidReconstruction(null);
    setValidNodes(null);
  };

  const decryptWithShares = async (shareSubset: string[]): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/blindfold_decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shares: shareSubset,
        cluster_size: nodeCount,
        threshold: threshold
      })
    });
    
    if (!response.ok) {
      throw new Error('Decrypt request failed');
    }
    
    const data: DecryptResponse = await response.json();
    
    return data.decrypted;
  };

  const handleStore = useCallback(async (): Promise<void> => {
    if (!secret.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setReconstructed(null);
    resetDetection();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/blindfold_encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: secret,
          cluster_size: nodeCount,
          threshold: threshold
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to encrypt secret');
      }
      
      const data: EncryptResponse = await response.json();
      
      setShares(data.shares);
      setOriginalShares([...data.shares]);
      setIsStored(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [secret, nodeCount, threshold]);

  const handleShareChange = (nodeIdx: number, newValue: string): void => {
    setShares((prev: any) => {
      const updated = [...prev];
      updated[nodeIdx] = newValue;
      return updated;
    });
    setReconstructed(null);
    resetDetection();
  };

  const handleReconstruct = useCallback(async (): Promise<void> => {
    if (!isStored) return;
    
    setIsLoading(true);
    setError(null);
    resetDetection();
    
    try {
      let allSharesResult: string;
      try {
        allSharesResult = await decryptWithShares(shares);
      } catch {
        allSharesResult = '[DECRYPTION FAILED]';
      }
      setReconstructed(allSharesResult);
      
      const combinations = getCombinations(nodeCount, threshold);
      const results: CombinationResult[] = [];
      const successCount: number[] = Array(nodeCount).fill(0);
      const failCount: number[] = Array(nodeCount).fill(0);
      
      for (const combo of combinations) {
        const comboShares = combo.map(idx => shares[idx]);
        let result: string;
        let isValid = false;
        
        try {
          result = await decryptWithShares(comboShares);
          isValid = result === secret;
        } catch {
          result = '[ERROR]';
          isValid = false;
        }
        
        results.push({ nodes: combo, result, isValid });
        
        for (const nodeIdx of combo) {
          if (isValid) {
            successCount[nodeIdx]++;
          } else {
            failCount[nodeIdx]++;
          }
        }
      }
      
      setCombinationResults(results);
      setNodeSuccessCount(successCount);
      setNodeFailCount(failCount);
      
      const malicious: number[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const total = successCount[i] + failCount[i];
        if (total > 0 && successCount[i] === 0 && failCount[i] > 0) {
          malicious.push(i);
        }
      }
      setMaliciousNodes(malicious);
      
      const validResult = results.find(r => r.isValid);
      if (validResult) {
        setValidReconstruction(validResult.result);
        setValidNodes(validResult.nodes);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [shares, secret, nodeCount, threshold, isStored]);

  const handleReset = (): void => {
    setSecret('');
    setShares([]);
    setOriginalShares([]);
    setReconstructed(null);
    setIsStored(false);
    setError(null);
    resetDetection();
  };

  const handleRestoreOriginal = (): void => {
    setShares([...originalShares]);
    setReconstructed(null);
    resetDetection();
  };

  const corruptShare = (nodeIdx: number): void => {
    setShares(prev => {
      const updated = [...prev];
      const share = updated[nodeIdx];
      if (share && share.length > 10) {
        const pos = 10;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let newChar = chars[Math.floor(Math.random() * chars.length)];
        while (newChar === share[pos]) {
          newChar = chars[Math.floor(Math.random() * chars.length)];
        }
        updated[nodeIdx] = share.slice(0, pos) + newChar + share.slice(pos + 1);
      }
      return updated;
    });
    setReconstructed(null);
    resetDetection();
  };

  const isMatch = reconstructed !== null && reconstructed === secret;
  const hasMalicious = maliciousNodes.length > 0;
  const hasDetectionResults = combinationResults.length > 0;
  const canRecover = validReconstruction !== null && validReconstruction === secret;
  const isSuccess = isMatch || canRecover;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">

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
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Blindfold Secret Sharing</h1>
          <p className="text-purple-200 text-sm">
            {threshold}-of-{nodeCount} threshold scheme
          </p>
          <p className="text-purple-300/60 text-xs mt-1">
            Github: <a href="https://github.com/NillionNetwork/blindfold-py" title="Blindfold GitHub" className="underline">blindfold-py</a>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400 rounded-xl p-4 mb-6 text-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-purple-200 text-sm font-medium mb-2">Enter Secret</label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter your secret message..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                disabled={isStored}
              />
            </div>
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Nodes</label>
              <div className="flex gap-2">
                {[3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setNodeCount(n);
                      setThreshold(n - 1);
                    }}
                    disabled={isStored}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      nodeCount === n ? 'bg-purple-500 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    } disabled:opacity-50`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <label className="text-purple-200 text-sm">Threshold:</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Math.max(2, Math.min(nodeCount, parseInt(e.target.value) || 2)))}
              min={2}
              max={nodeCount}
              disabled={isStored}
              className="w-20 px-3 py-2 rounded-lg bg-white/10 border border-purple-400/30 text-white focus:outline-none"
            />
            <span className="text-purple-300/60 text-sm">({threshold} shares needed to reconstruct)</span>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <button
              onClick={handleStore}
              disabled={!secret.trim() || isStored || isLoading}
              className="flex-1 min-w-[140px] py-3 px-6 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && !isStored ? 'Encrypting...' : 'Encrypt & Distribute'}
            </button>
            <button
              onClick={handleReconstruct}
              disabled={!isStored || isLoading}
              className="flex-1 min-w-[140px] py-3 px-6 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && isStored ? 'Analyzing...' : 'Decrypt & Detect'}
            </button>
            {isStored && (
              <button onClick={handleRestoreOriginal} className="py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium">
                Restore Original
              </button>
            )}
            <button onClick={handleReset} className="py-3 px-6 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium">
              Reset
            </button>
          </div>
        </div>

        {isStored && !reconstructed && (
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4 mb-6 text-yellow-200 text-sm">
            <strong>Try it:</strong> Click "Corrupt Share" on any node or edit its share directly, then click "Decrypt & Detect".
          </div>
        )}

        <div className={`grid gap-4 mb-6 ${nodeCount === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
          {Array.from({ length: nodeCount }, (_, i) => (
            <div key={i}>
              <NodeCard
                nodeId={i + 1}
                share={shares[i] || ''}
                onShareChange={handleShareChange}
                isStored={isStored}
                isMalicious={maliciousNodes.includes(i)}
                isClean={hasDetectionResults && !maliciousNodes.includes(i) && maliciousNodes.length > 0}
                successCount={hasDetectionResults ? nodeSuccessCount[i] : undefined}
                failCount={hasDetectionResults ? nodeFailCount[i] : undefined}
              />
              {isStored && !hasDetectionResults && (
                <button
                  onClick={() => corruptShare(i)}
                  className="mt-2 w-full py-1 px-2 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-medium transition-all"
                >
                  Corrupt Share
                </button>
              )}
            </div>
          ))}
        </div>

        {reconstructed !== null && (
          <div className={`rounded-xl p-6 mb-6 ${isSuccess ? 'bg-green-500/20 border border-green-400' : 'bg-red-500/20 border border-red-400'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{isSuccess ? '✓' : '✗'}</span>
              <span className={`font-semibold ${isSuccess ? 'text-green-300' : 'text-red-300'}`}>
                {isMatch && !hasMalicious
                  ? 'Secret Successfully Decrypted!'
                  : canRecover
                    ? 'Secret Successfully Recovered!'
                    : 'Decryption Failed!'}
              </span>
            </div>
            
            {/* Warning banner for malicious nodes */}
            {hasMalicious && canRecover && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
                <span className="text-yellow-400 text-xl">⚠️</span>
                <span className="text-yellow-200 text-sm">
                  <strong>Warning:</strong> Corrupted share detected in Node {maliciousNodes.map(n => n + 1).join(', ')}. 
                  Secret was recovered using honest nodes.
                </span>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Original:</div>
                <div className="font-mono bg-black/20 p-3 rounded text-white">{secret}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  {canRecover && hasMalicious ? 'Recovered (excluding malicious):' : 'Decrypted:'}
                </div>
                <div className={`font-mono bg-black/20 p-3 rounded ${isSuccess ? 'text-green-300' : 'text-red-300'}`}>
                  {canRecover && hasMalicious ? validReconstruction : reconstructed}
                </div>
              </div>
            </div>
            
            {/* Show which nodes were used for recovery */}
            {hasMalicious && canRecover && validNodes && (
              <div className="mt-3 text-xs text-green-400">
                ✓ Reconstructed using nodes: {validNodes.map(n => n + 1).join(', ')}
              </div>
            )}
            
            {/* Show failed decryption details if cannot recover */}
            {!isSuccess && hasMalicious && (
              <div className="mt-4 p-3 bg-red-900/30 rounded-lg">
                <div className="text-xs text-red-400 mb-1">Suspected malicious nodes: {maliciousNodes.map(n => n + 1).join(', ')}</div>
                <div className="text-xs text-red-300">Unable to recover the original secret from available shares.</div>
              </div>
            )}
          </div>
        )}

        {hasDetectionResults && (
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Decryption Analysis</h3>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {combinationResults.map((result, idx) => (
                <div key={idx} className={`flex items-center justify-between p-2 rounded text-sm ${result.isValid ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                  <span>Nodes [{result.nodes.map(n => n + 1).join(', ')}]</span>
                  <span className="font-mono truncate max-w-[200px]">
                    {result.isValid ? '✓ Valid' : `✗ "${result.result.slice(0, 20)}${result.result.length > 20 ? '...' : ''}"`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/5 rounded-xl p-4 text-purple-200 text-sm">
          <p className="mb-2">
            <strong>How detection works:</strong> Using a {threshold}-of-{nodeCount} threshold, 
            we try all combinations of {threshold} shares. The malicious node appears in all 
            failing decryptions and none of the successful ones.
          </p>
          <p>
            <strong>Try it:</strong> After encrypting, click "Corrupt" on any node or edit its base64 share. 
            The system will identify the tampered node and recover the secret using honest nodes.
          </p>
        </div>
      </div>
    </div>
  );
}