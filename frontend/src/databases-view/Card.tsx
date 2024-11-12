function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-2.5 shadow-lg">
      {children}
    </div>
  );
}

export default Card;
