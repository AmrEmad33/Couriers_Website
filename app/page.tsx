"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NavigationMenuDemo } from "./components/nav";
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
import DateFilter from "./components/filter";
import {
  GETALLORDERS,
  ordersProps,
  GETALLCOURIERS,
  usersProps,
  DELETEORDERS,
  TransferOrders,
} from "./api/api";
import DialogCloseButton from "./components/modal";
import Link from "next/link";
import { TransferModal } from "./components/transferModal";
import { Progress } from "@/components/ui/progress";
import WarningModal from "./components/modal";
import { useRouter } from "next/navigation";
import EditDialog, { editTableProps } from "./components/editModal";
import { Input } from "@/components/ui/input";
const itemsPerPage = 10;

export default function Home() {
  const router = useRouter();
  const [originalData, setoriginalData] = useState<ordersProps[]>([]);
  const [filterCourier, setFilterCourier] = useState<usersProps>();
  const [courierData, setCouriersData] = useState<usersProps[]>([]);
  const [courier, setCourier] = useState<usersProps>({} as usersProps);
  const [rowData, setRowData] = useState<editTableProps>({} as editTableProps);
  const [filteredData, setFilteredData] = useState<ordersProps[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("Warning");
  const [progressValue, setProgressValue] = useState<number>(13);
  const [img, setImg] = useState<string>("non");
  const [currentPage, setCurrentPage] = useState(1);
  const [isWarningDialog, setWarningDialog] = useState(false);
  const [isTransferModal, setTransferModal] = useState(false);
  const [id, setCurrentId] = useState<string>("");
  const [warning1, setWarning1] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [edit, setEdtiModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [total, setTotal] = useState<string>();
  const [message, setMessage] = useState<string>(
    "Test Warning Close This window"
  );

  const getFormattedTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProgressValue(50);
        const data = await GETALLORDERS();
        const todayDate = getFormattedTodayDate();
        const filteredOrders = data.filter(
          (order) => order.order_date === todayDate
        );
        console.log("Filtered Orders");
        console.log(filteredOrders);
        setProgressValue(75);
        const courier = await GETALLCOURIERS();
        setCouriersData(courier);
        setoriginalData(data);
        setFilteredData(filteredOrders);
        setProgressValue(100);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = originalData.filter(
      (item) =>
        item.id.toString().toLowerCase().includes(lowercasedQuery) ||
        item.customer_name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const isChecked = (orderId: string) => selectedItems.includes(orderId);
  const handleDeleteOrder = async () => {
    setProgressValue(75);
    await DELETEORDERS([id]);
    setProgressValue(90);
    setoriginalData((prevOrders) =>
      prevOrders.filter((order) => order.id != id)
    );
    setFilteredData((prevOrders) =>
      prevOrders.filter((order) => order.id != id)
    );
    setSelectedItems([]);

    setWarningDialog(false);
    setProgressValue(100);
  };
  const handleCourierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value == "") {
      setFilteredData(originalData);
      return;
    }
    const filtered = originalData.filter(
      (item) =>
        item.courier_name.toString().toLowerCase() ==
        event.target.value.toString().toLowerCase()
    );
    setFilteredData(filtered);
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
    setSelectedItems([]);
    setWarningDialog(false);
    setProgressValue(100);
  };
  const handleTransferOrders = async () => {
    console.log(courier);
    var orders = [] as ordersProps[];
    for (var orderId of selectedItems) {
      const order = originalData.find((o) => o.id === orderId);
      if (order && courier) {
        order.courier_id = courier.id;
        order.courier_name = courier.name;
        orders.push(order);
      }
    }
    if (courier) {
      setTransferModal(false);
      setProgressValue(50);
      await TransferOrders(orders);
      setSelectedItems([]);
      setProgressValue(100);
    } else {
      setError(true);
      console.log("error");
    }
  };
  const handleCheckboxChange = (orderId: string) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = prevSelectedItems.includes(orderId)
        ? prevSelectedItems.filter((id) => id !== orderId)
        : [...prevSelectedItems, orderId];
      return newSelectedItems;
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleFilter = (date: string) => {
    if (date) {
      const formattedDate = formatDate(date);
      setFilteredData(
        originalData.filter(
          (item) => formatDate(item.order_date) === formattedDate
        )
      );
    } else {
      setFilteredData(originalData);
      console.log("Couldn't Filter");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const isDisabled = (): boolean => selectedItems.length === 0;

  return (
    <>
      <NavigationMenuDemo />
      <div className="w-full h-2/5 items-center grid justify-center justify-col-1 gap-10">
        <WarningModal
          isOpen={warning1}
          setIsOpen={setWarning1}
          title={title}
          imgLink={img}
          message={message}
          submitFuction={handleDeleteOrder}
        />
        <WarningModal
          isOpen={isWarningDialog}
          setIsOpen={setWarningDialog}
          title={title}
          imgLink={img}
          message={message}
          submitFuction={handleDeleteOrders}
        />
        <TransferModal
          isOpen={isTransferModal}
          setIsOpen={setTransferModal}
          title={title}
          imgLink={img}
          message={message}
          comboBoxData={courierData}
          submitFuction={handleTransferOrders}
          setCourier={setCourier}
          courier={courier}
        />
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between">
            <DateFilter onFilter={handleFilter} />
            <div className="flex justify-start gap-5">
              <Button
                variant={"default"}
                onClick={() => {
                  setTransferModal(true);
                  setMessage("Are you sure you want to transfer these orders");
                  setTitle("Transfer Courier");
                  setImg("Img Link");
                }}
                disabled={isDisabled()}
              >
                Transfer Orders
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setMessage("Are you sure you want to delete selected Items");
                  setTitle("Warning");
                  setImg("Img Link");
                  setWarningDialog(true);
                }}
                disabled={isDisabled()}
              >
                Delete Selected
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex justify-start">
              <Search color="black" className="mr-2 mt-2 h-4 w-4 text-center" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs  border p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end w-1/5">
              <select
                onChange={handleCourierChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Filter By Courier</option>
                {courierData.map((courier) => (
                  <option key={courier.id} value={courier.name}>
                    {courier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {progressValue < 100 && (
          <div className="w-full flex justify-center">
            <Progress value={progressValue} />
          </div>
        )}
        <Table className="border border-black-300">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead className="w-1 text-center">Date</TableHead>
              <TableHead className="w-1 text-center">Order ID</TableHead>
              <TableHead className="w-1 text-center">Customer Name</TableHead>
              <TableHead className="w-1 text-center">Courier Name</TableHead>
              <TableHead className="w-1 text-center">Zone</TableHead>
              <TableHead className="w-25 text-center">
                Arabic Location
              </TableHead>
              <TableHead className="w-1 text-center">Method</TableHead>
              <TableHead className="w-1 text-center">Status</TableHead>
              <TableHead className="w-1 text-center">Amount</TableHead>
              <TableHead className="w-1 text-center">Delivery Fee</TableHead>
              <TableHead className="w-1 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id.toString()}>
                <TableCell className="font-medium text-center table-cell">
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
                <TableCell className="text-center">
                  {item.courier_name}
                </TableCell>
                <TableCell className="text-center">
                  {item.domestic_zone}
                </TableCell>
                <TableCell className="text-center">
                  {item.arabic_location}
                </TableCell>
                <TableCell className="text-center">
                  {item.payment_method}
                </TableCell>

                <TableCell
                  className={`text-center ${
                    item.is_delivered === 0
                      ? "text-yellow-600"
                      : item.is_delivered === 1
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.is_delivered === 0
                    ? "Pending"
                    : item.is_delivered === 1
                    ? "Delivered"
                    : "Cancelled"}
                </TableCell>
                <TableCell className="text-center">{item.total}</TableCell>
                <TableCell className="text-center">
                  {item.delivery_fee}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-start text-center space-y-1">
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
                        setWarning1(true);
                        setMessage("Are you sure you want to delete this item");
                        setTitle("Warning");
                        setImg("No Image");
                        setCurrentId(item.id);
                      }}
                    >
                      <Trash2 color="red" className="mr-2 h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => {
                        setEdtiModal(true);
                      }}
                      variant={"link"}
                    >
                      <Eye
                        onClick={() => {
                          router.push("/details/" + item.id);
                        }}
                        className="mr-2 h-4 w-4"
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="text-center">Total</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">..</TableCell>
              <TableCell className="text-center">
                {filteredData.reduce((acc, item) => acc + item.total, 0)}
              </TableCell>
              <TableCell className="text-center">
                {filteredData.reduce((acc, item) => acc + item.delivery_fee, 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-center mt-4">
          <Button
            variant={"link"}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant={"link"}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
}
