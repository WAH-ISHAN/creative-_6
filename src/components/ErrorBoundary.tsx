import React from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Top-level error boundary. Instead of React unmounting to a blank white page on
 * an unexpected render error, we show an on-brand fallback (matching the site's
 * dark theme + display/tech fonts) with a way to recover.
 *
 * Note: this project has no @types/react, so React's own class members aren't
 * typed. We `declare` the members this component uses so it type-checks without
 * pulling in a global types dependency that would surface errors elsewhere.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;
  declare setState: (state: Partial<State>) => void;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Surface the error for logging/monitoring without crashing the page.
    console.error('[ErrorBoundary] Unhandled render error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[var(--fx-black)] text-[var(--fx-white)] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl sm:text-5xl font-editorial uppercase tracking-tight leading-tight">
            Something<br />went wrong.
          </h1>
          <p className="text-sm font-tech text-[var(--fx-gray)] mt-4 leading-relaxed">
            An unexpected error interrupted the page. Please reload — if it keeps
            happening, reach us at{' '}
            <a href="tel:+94777548671" className="text-[var(--fx-yellow)] hover:underline">
              +94 77 754 8671
            </a>.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-8 inline-flex items-center gap-2 border border-[var(--fx-white)]/30 hover:border-[var(--fx-yellow)] text-[var(--fx-white)] hover:text-[var(--fx-yellow)] font-mono-tech text-xs uppercase tracking-widest px-6 py-3 transition-colors"
          >
            Reload the page
          </button>
        </div>
      </div>
    );
  }
}
