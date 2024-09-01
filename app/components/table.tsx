import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DELETEORDERS, ordersProps, usersProps } from "../api/api";
const CustomTable = () => {
      const [originalData, setoriginalData] = useState<ordersProps[]>([]);
  const [courierData, setCouriersData] = useState<usersProps[]>([]);
  const [filteredData, setFilteredData] = useState<ordersProps[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("Warning");
  const [progressValue, setProgressValue] = useState<number>(13);
  const [img, setImg] = useState<string>("non");
  const [currentPage, setCurrentPage] = useState(1);
  const [isWarningDialog, setWarningDialog] = useState(false);
  const [isTransferModal, setTransferModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Add search query state
  const [behavior, setBehavior] = useState<() => void | undefined>();
  const [message, setMessage] = useState<string>(
    "Test Warning Close This window"
  );
     const isChecked = (orderId: string) => selectedItems.includes(orderId);
  const handleDeleteOrder = async (orderId: string) => {
    setProgressValue(75);
    await DELETEORDERS([orderId]);
    setProgressValue(90);
    setoriginalData((prevOrders) =>
      prevOrders.filter((order) => !selectedItems.includes(order.id))
    );
    setFilteredData((prevOrders) =>
      prevOrders.filter((order) => !selectedItems.includes(order.id))
    );

    setWarningDialog(false); // Optionally close the dialog after deletion
    setProgressValue(100);
  };
  const handleDeleteOrders = async () => {
    console.log(selectedItems);
    setProgressValue(75);
    await DELETEORDERS(selectedItems);
    setProgressValue(90);
    setoriginalData((prevOrders) =>
      prevOrders.filter((order) => !selectedItems.includes(order.id))
    );
    setFilteredData((prevOrders) =>
      prevOrders.filter((order) => !selectedItems.includes(order.id))
    );

    setWarningDialog(false); // Optionally close the dialog after deletion
    setProgressValue(100);
  };
  const handleCheckboxChange = (orderId: string) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = prevSelectedItems.includes(orderId)
        ? prevSelectedItems.filter((id) => id !== orderId)
        : [...prevSelectedItems, orderId];
      return newSelectedItems;
    });
  };
  return (
  <Table className="border border-black-300">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead className="w-auto text-center">Date</TableHead>
            <TableHead className="w-auto text-center">Order ID</TableHead>
            <TableHead className="w-auto text-center">Customer Name</TableHead>
            <TableHead className="w-auto text-center">Courier Name</TableHead>
            <TableHead className="w-auto text-center">Method</TableHead>
            <TableHead className="w-auto text-center">Status</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item) => (
            <TableRow key={item.id.toString()}>
              <TableCell className="font-medium">
                <input
                  type="checkbox"
                  className="ml-3"
                  id={`checkbox-${item.id}`}
                  checked={isChecked(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </TableCell>
              <TableCell className="font-medium text-center">
                {item.order_date}
              </TableCell>
              <TableCell className="font-medium text-center">
                {item.id}
              </TableCell>
              <TableCell className="text-center">
                {item.customer_name}
              </TableCell>
              <TableCell className="text-center">{item.courier_name}</TableCell>
              <TableCell className="text-center">
                {item.payment_method}
              </TableCell>
              <TableCell
                className={`text-center ${
                  item.is_delivered === 0 ? "text-yellow-600" : "text-green-500"
                }`}
              >
                {item.is_delivered === 0 ? "Pending" : "Delivered"}
              </TableCell>
              <TableCell className="text-center">{item.total}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-start text-center">
                  <Button variant={"link"}>
                    <Link
                      href={item.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin color="blue" className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant={"link"}
                    onClick={() => {
                      setWarningDialog(true);
                      setMessage("Are you sure you want to delete this item");
                      setTitle("Warning");
                      setImg("No Image");
                      setBehavior(handleDeleteOrder(item.id));
                    }}
                  >
                    <Trash2 color="red" className="mr-2 h-4 w-4" />
                  </Button>
                  <Button variant={"link"}>
                    <Eye className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>  
)>;
};

export default CustomTable;
