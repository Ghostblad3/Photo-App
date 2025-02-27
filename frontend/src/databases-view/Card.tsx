import { ReactNode } from 'react';

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-2.5 shadow-lg">
      {children}
    </div>
  );
}

export { Card };
