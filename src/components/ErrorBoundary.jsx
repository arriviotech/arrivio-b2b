import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep this log: it makes debugging production blanks much easier.
    // eslint-disable-next-line no-console
    console.error("UI crashed:", error, errorInfo);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-3xl rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-xl font-extrabold text-gray-900">Something crashed</h1>
          <p className="text-sm text-gray-600 mt-2">
            Open DevTools Console for the full stack trace. The key error is shown below.
          </p>
          <pre className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs overflow-auto">
            {String(error?.stack || error?.message || error)}
          </pre>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="h-10 px-4 rounded-xl bg-[#0a1a12] text-white font-bold hover:bg-black transition-colors"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="h-10 px-4 rounded-xl border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}

