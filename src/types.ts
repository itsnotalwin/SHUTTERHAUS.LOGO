import React from 'react';

export interface Palette {
  id: 'dark' | 'light';
  bg: string;
  fg: string;
  cardBg: string;
  cardBorder: string;
  name: string;
  desc: string;
}

export interface IconDef {
  name: string;
  render: (fg: string) => React.ReactNode;
}

export interface LayoutDef {
  name: string;
  render: (fontStyle: string, fg: string) => React.ReactNode;
}

export interface LogoConcept {
  id: string;
  palette: Palette;
  iconIndex: number;
  layoutIndex: number;
  fontMain: 'Cinzel' | 'Montserrat';
  transparent: boolean;
}

