import React from "react";
import { useState, createContext } from "react";

export type GlobalContext = {
  fields: string[];
  setFields: React.Dispatch<React.SetStateAction<string[]>>;
  visibleFields: string[];
  setVisibleFields: React.Dispatch<React.SetStateAction<string[]>>;
  data: { [key: string]: string }[];
  setData: React.Dispatch<React.SetStateAction<{ [key: string]: string }[]>>;
};

type Props = {
  children?: React.ReactNode;
};

export const DataContext = createContext<GlobalContext>({
  fields: [],
  setFields: () => {},
  visibleFields: [],
  setVisibleFields: () => {},
  data: [],
  setData: () => {},
});

function Context({ children }: Props) {
  const [fields, setFields] = useState<string[]>([]);
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [data, setData] = useState<{ [key: string]: string }[]>([]);

  return (
    <DataContext.Provider
      value={{
        fields,
        setFields,
        visibleFields,
        setVisibleFields,
        data,
        setData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default Context;
