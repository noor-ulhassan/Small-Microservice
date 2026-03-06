"use client";

import { useActionState } from "react";
import { analyzeText } from "./actions";

// We define the initial state of our form action
const initialState = {
  count: 0,
  engine: "",
  status: "",
  error: "",
};

export default function Home() {
  // useActionState connects our React Client Component directly to the Server Action
  const [state, formAction, isPending] = useActionState(
    analyzeText,
    initialState,
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 p-8 flex flex-col items-center justify-center font-sans selection:bg-indigo-500/30">
      <div className="w-full max-w-2xl bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
            Word-Scale{" "}
            <span className="font-semibold text-indigo-400">Engine</span>
          </h1>
          <p className="text-neutral-400 text-sm">
            Decoupled Text Analytics via Python FastAPI
          </p>
        </header>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              name="text"
              placeholder="Paste large text blocks here for asynchronous analysis..."
              className="w-full h-48 bg-neutral-950/50 border border-neutral-800 rounded-xl p-4 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="self-end px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing Compute...
              </>
            ) : (
              "Analyze Text"
            )}
          </button>
        </form>

        {/* Results Persistence Section */}
        {state && (state.status || state.error) && (
          <div
            className={`mt-8 p-6 rounded-xl border ${state.error ? "bg-red-950/20 border-red-900/50" : "bg-neutral-950/50 border-neutral-800"}`}
          >
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-4 font-semibold">
              Execution Result
            </h3>

            {state.error ? (
              <div className="flex flex-col gap-2">
                <p className="text-red-400">{state.error}</p>
                <div className="text-xs text-neutral-500 border border-neutral-800 rounded px-2 py-1 self-start">
                  Handled by:{" "}
                  <span className="text-neutral-400">{state.engine}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-light text-white mb-1">
                    {state.count}{" "}
                    <span className="text-lg text-neutral-500 font-normal">
                      words
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-500 mb-1">
                    Processed By
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {state.engine}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-neutral-600 text-sm">
        <p>Private Bridged Docker Network Visualization</p>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          Next.js 15 → Gateway → FastAPI
        </p>
      </footer>
    </main>
  );
}
