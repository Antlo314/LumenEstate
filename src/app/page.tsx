export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black font-sans w-full">
      <main className="flex flex-col w-full max-w-4xl p-8 lg:p-12 border border-zinc-800 rounded-2xl bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Bespoke Operating System
          </h1>
          <p className="text-zinc-400 text-lg">
            Real Estate Autonomous Engine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Token Ledger Module Placeholder */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-black flex flex-col gap-4">
            <h2 className="text-zinc-100 font-medium text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Token Ledger
            </h2>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-zinc-500 text-sm">Available Credits</p>
                <p className="text-3xl font-mono text-white mt-1">---</p>
              </div>
              <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm transition-colors text-white">
                Manage
              </button>
            </div>
          </div>

          {/* Active Properties Placeholder */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-black flex flex-col gap-4">
            <h2 className="text-zinc-100 font-medium text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Active Properties
            </h2>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-zinc-500 text-sm">Monitored Assets</p>
                <p className="text-3xl font-mono text-white mt-1">---</p>
              </div>
              <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm transition-colors text-white">
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border border-zinc-800 rounded-xl bg-black flex flex-col items-center justify-center py-16">
          <p className="text-zinc-500 mb-6 text-center max-w-md">
            Initialize the Predictive Deal Engine to query property viablity scores and trigger omnichannel agents.
          </p>
          <button className="px-8 py-3 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors">
            INITIALIZE ENGINE
          </button>
        </div>
      </main>
    </div>
  );
}
