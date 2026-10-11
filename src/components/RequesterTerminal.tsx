'use client';

import React, { useState } from 'react';
import { TaskContract } from '@/types/task';
import { deconstructTaskWithAI } from '@/lib/gemini';
import { TaskContractCard } from '@/components/TaskContractCard';
import { TelemetryRadar } from '@/components/TelemetryRadar';
import { 
  Terminal, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Clock,
  Compass,
  Cpu
} from 'lucide-react';

interface RequesterTerminalProps {
  onDispatchTask: (contract: TaskContract) => void;
  dispatchedTaskIds: Set<string>;
  onSwitchToProxyView: () => void;
}

const PROMPT_SUGGESTIONS = [
  {
    title: 'Warangal RTO Counter 3',
    tag: 'Govt Office & Tokens',
    prompt: "Verify if counter 3 at Warangal RTO is open and get a photo of today's token list",
  },
  {
    title: 'MGM Hospital OP Queue',
    tag: 'Queue Proxy Stand-in',
    prompt: 'Wait in the outpatient queue at MGM Hospital for 20 minutes until my family arrives',
  },
  {
    title: 'Nakkalagutta Electronics',
    tag: 'Retail Inventory Check',
    prompt: 'Check if the electronics shop on Nakkalagutta main road has Arduino Mega in stock',
  },
];

export const RequesterTerminal: React.FC<RequesterTerminalProps> = ({
  onDispatchTask,
  dispatchedTaskIds,
  onSwitchToProxyView,
}) => {
  const [prompt, setPrompt] = useState<string>(PROMPT_SUGGESTIONS[0].prompt);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compiledContract, setCompiledContract] = useState<TaskContract | null>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(false);

  const handleDeconstruct = async () => {
    if (!prompt.trim()) return;
    setIsCompiling(true);
    setDispatchedSuccess(false);

    try {
      const contract = await deconstructTaskWithAI(prompt.trim());
      setCompiledContract(contract);
    } catch (err) {
      console.error('Error compiling task:', err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDispatch = async (contract: TaskContract) => {
    setIsDispatching(true);
    await new Promise((r) => setTimeout(r, 600));
    onDispatchTask(contract);
    setIsDispatching(false);
    setDispatchedSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono text-cyan-400 mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI TASK-TO-CONTRACT COMPILER (GEMINI PROTOCOL)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Delegate Any Physical Errand in Seconds
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Turn unstructured natural human intent into mathematical, geofenced, cryptographically safe Smart Task Contracts with live peer proxies on the ground.
          </p>
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input & Suggestions Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Input Terminal Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>REQUESTER_PROMPT_INPUT</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Multimodal Errand Parser
              </span>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your physical errand in natural language..."
                rows={4}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 p-4 text-sm text-slate-100 placeholder-slate-500 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans leading-relaxed transition-all"
              />
              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-500">
                {prompt.length} chars
              </div>
            </div>

            {/* Suggested Prompts Section */}
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                <span>Preset Quick-Test Scenarios (Tri-City Locations):</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {PROMPT_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(item.prompt)}
                    className={`flex items-start justify-between rounded-xl border p-3 text-left transition-all group ${
                      prompt === item.prompt
                        ? 'border-emerald-500/50 bg-emerald-950/20 text-white shadow-sm shadow-emerald-500/10'
                        : 'border-slate-800/80 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                          {item.title}
                        </span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono text-slate-400">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        "{item.prompt}"
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-cyan-400 transition-colors mt-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Deconstruct Action Button */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Deterministic Zero-Crash Fallback Active</span>
              </div>

              <button
                id="btn-deconstruct"
                disabled={isCompiling || !prompt.trim()}
                onClick={handleDeconstruct}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all active:scale-95 disabled:opacity-50"
              >
                {isCompiling ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Deconstructing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Deconstruct with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Post-Dispatch Success Banner */}
          {dispatchedSuccess && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-5 text-emerald-300 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Smart Contract Dispatched to Mesh Grid!
                    </h4>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      Nearby peer proxies are receiving real-time geofence alerts on their terminals.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onSwitchToProxyView}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <span>View in Proxy Feed</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Radar & Compiled Contract Output Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Warangal Proximity Radar */}
          <TelemetryRadar />

          {/* Compiled Smart Task Contract Output */}
          {compiledContract ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  Compiled Contract Preview
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Status: {compiledContract.status}
                </span>
              </div>
              <TaskContractCard
                contract={compiledContract}
                onDispatch={handleDispatch}
                isDispatching={isDispatching}
                isAlreadyDispatched={dispatchedTaskIds.has(compiledContract.id)}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-slate-500">
              <Terminal className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">No Contract Compiled Yet</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Type an errand above and click <strong>"Deconstruct with AI"</strong> to generate the structured contract.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
