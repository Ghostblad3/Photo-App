function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg flex flex-col items-center p-2.5 shadow-lg">
      {children}
    </div>
  );
}

export default Card;
