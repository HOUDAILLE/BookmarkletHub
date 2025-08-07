"use client";

import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function CodeEditor({
  value,
  onChange,
  placeholder = "// Votre code JavaScript ici",
  rows = 10,
}: CodeEditorProps) {
  return (
    <textarea
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64 font-mono"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      spellCheck="false"
      autoCapitalize="off"
      autoCorrect="off"
      data-gramm="false"
    />
  );
}
