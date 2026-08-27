import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import { storage, fetchHealth } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('autonomous');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(storage.getApiKey());
      setProvider(storage.getProvider());
      fetchHealth().then(setHealthStatus).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setApiKey(apiKey.trim());
    storage.setProvider(provider);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fade-in text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">AI Engine & API Settings</h3>
              <p className="text-slate-400 text-[11px]">Configure tool-calling backend provider</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Reasoning Engine Provider:
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                  provider === 'autonomous'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="autonomous"
                  checked={provider === 'autonomous'}
                  onChange={() => setProvider('autonomous')}
                  className="mt-0.5 text-blue-500"
                />
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>Autonomous Engine (Zero-Config / Built-in)</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-normal border border-emerald-700/50">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Executes full autonomous multi-step reasoning, skill gap assessments, course queries, and roadmaps without requiring an external API key.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                  provider === 'claude'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="claude"
                  checked={provider === 'claude'}
                  onChange={() => setProvider('claude')}
                  className="mt-0.5 text-blue-500"
                />
                <div>
                  <div className="font-bold text-xs">Anthropic Claude (Messages API / Tool Use)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Calls Anthropic Claude 3.7 Sonnet directly with function calling and tool results looping.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Anthropic API Key input */}
          {provider === 'claude' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Anthropic API Key:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Stored locally in your browser session or read from server <code>.env</code> file.
              </p>
            </div>
          )}

          {/* Server status info */}
          {healthStatus && (
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Dataset Careers Loaded:</span>
                <span className="font-bold text-slate-200">{healthStatus.careerCount} paths</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dataset Courses Loaded:</span>
                <span className="font-bold text-slate-200">{healthStatus.courseCount} courses</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Server API Key Configured:</span>
                <span className="font-bold text-slate-200">{healthStatus.hasAnthropicKey ? 'Yes (via .env)' : 'None (Using Autonomous)'}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
