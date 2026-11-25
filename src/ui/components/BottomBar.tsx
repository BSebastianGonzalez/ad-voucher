import type { ReactNode } from 'react';

interface BottomBarProps {
  children: ReactNode;
}

export function BottomBar({ children }: BottomBarProps) {
  return (
    <div className="bottom-bar">
      <div className="bottom-bar-inner">{children}</div>
    </div>
  );
}
