import React from 'react';
import { RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unexpected application error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090D] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#1B1D27] border border-white/10 rounded-2xl p-6 space-y-4">
            <h1 className="font-display text-2xl font-bold text-[#C8FF24]">
              Something went wrong
            </h1>
            <p className="text-sm text-[#A5A7B2] break-words">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#791EFF] hover:bg-[#8D42FF] text-white text-sm font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
