"use client";

import React from "react";
import { Button } from "./ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-destructive/10 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Oops, ceva nu a mers bine
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Te rugăm să încerci din nou sau să reîncarci pagina.
          </p>
          <Button onClick={this.handleReload} variant="outline">
            Reîncarcă pagina
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
