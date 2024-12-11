"use client";

import React from "react";
import ReactSnowfall from "react-snowfall";

interface SnowfallProps {
  color?: string;
  snowflakeCount?: number;
  style?: React.CSSProperties;
}

export function Snowfall({ color, snowflakeCount = 50, style }: SnowfallProps) {
  return (
    <ReactSnowfall
      color={color}
      snowflakeCount={snowflakeCount}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
