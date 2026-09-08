import React from "react";

interface ProGateProps {
  children: React.ReactNode;
  featureName?: string;
  description?: string;
}

export const ProGate: React.FC<ProGateProps> = ({ children }) => {
  return <>{children}</>;
};

