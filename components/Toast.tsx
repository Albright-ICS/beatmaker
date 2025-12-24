'use client';

import React from 'react';

interface Props {
  message: string;
}

export const Toast: React.FC<Props> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-slate-100 border border-slate-700 shadow-lg rounded-lg px-4 py-2 animate-pulseGlow">
      {message}
    </div>
  );
};
