/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { DataContext } from "./Context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Records() {
  const { data, visibleFields } = useContext(DataContext);

  // use Memo?
  const displayableData = () => {
    return data.map((item) => {
      const temp: { key: string; [key: string]: string } = {
        key: Math.random().toString(36),
      };

      visibleFields.forEach((field) => (temp[field] = item[field]));

      return temp;
    });
  };

  return (
    <>
      <div style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}>
        <Table className="overflow-y-auto">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              {visibleFields.map((item) => (
                <TableHead key={item}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayableData().map((item) => (
              <TableRow key={item.key}>
                {visibleFields.map((field) => (
                  <TableCell key={field}>{item[field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Records;
