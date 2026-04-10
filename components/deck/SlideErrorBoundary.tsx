"use client";

import React from "react";

type Props = {
  slideNumber: number;
  slideType: string;
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage: string;
};

// Wraps each slide so one broken render doesn't take down the whole deck.
// Shows the error inline with slide number + type so we know which one
// to fix. Other slides keep working and can be navigated to.
export default class SlideErrorBoundary extends React.Component<Props, State> {
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
      `[SlideErrorBoundary] slide ${this.props.slideNumber} (${this.props.slideType}) crashed:`,
      error,
      info
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="body"
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: "2cqh",
            textAlign: "center",
          }}
        >
          <p className="label">Slide error</p>
          <div className="rule" style={{ marginInline: "auto" }} />
          <h2
            className="serif"
            style={{
              fontSize: "clamp(1.2rem, 2.4cqw, 2rem)",
              color: "var(--ivory)",
              maxWidth: "80%",
            }}
          >
            Slide {this.props.slideNumber} &mdash;{" "}
            <span className="gold em">{this.props.slideType}</span> failed to
            render.
          </h2>
          <p
            className="body-s"
            style={{ maxWidth: "70%", color: "var(--ivory-dim)" }}
          >
            {this.state.errorMessage}
          </p>
          <p
            className="body-s"
            style={{
              maxWidth: "70%",
              color: "var(--gold-dim)",
              fontStyle: "italic",
            }}
          >
            The other slides still work &mdash; use the arrows or dots to keep
            navigating.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
