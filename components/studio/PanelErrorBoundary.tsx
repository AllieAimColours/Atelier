"use client";

import React from "react";

type Props = {
  paneName: string;
  children: React.ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
  errorMessage: string;
};

// Wraps editor / chat panels in the Studio so a crash inside one pane
// doesn't take down the whole /studio page. Shows the error inline with
// a Retry button that resets the boundary state.
export default class PanelErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message ?? "Unknown error",
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[PanelErrorBoundary] ${this.props.paneName} crashed:`,
      error,
      info
    );
  }

  componentDidUpdate(prevProps: Props) {
    // If the pane identity changes (e.g., switching slides), reset the boundary
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: "" });
    }
  }

  reset = () => {
    this.setState({ hasError: false, errorMessage: "" });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <div className="studio__edit-head">
            <p className="studio__edit-label" style={{ color: "#d87171" }}>
              {this.props.paneName} error
            </p>
            <h2 className="studio__edit-title">Something broke</h2>
          </div>
          <div className="studio__edit-body">
            <div className="studio__stub" style={{ textAlign: "left" }}>
              <p
                style={{
                  color: "#d87171",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: ".78rem",
                  padding: ".8rem",
                  border: "1px solid rgba(216,113,113,.3)",
                  background: "rgba(216,113,113,.05)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {this.state.errorMessage}
              </p>
              <p style={{ marginTop: "1rem", color: "var(--ivory-dim)" }}>
                This pane crashed but the rest of the Studio still works.
                Switch slides, try another tab, or click Retry below.
              </p>
            </div>
          </div>
          <div className="studio__edit-foot">
            <span className="studio__edit-foot-status">—</span>
            <button className="studio__btn studio__btn--ghost" onClick={this.reset}>
              Retry
            </button>
          </div>
        </>
      );
    }
    return this.props.children;
  }
}
