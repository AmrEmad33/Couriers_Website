"use client";
import { useEffect, useState } from "react";
import { NavigationMenuDemo } from "../components/nav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ADDNEWORDERS, UPDATEORDERSTATUS } from "../api/api";
import WarningModal from "../components/modal";
import { startOfToday } from "date-fns";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AddOrderPage() {
  const [progress, setProgressValue] = useState(100);
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Please Close this window");
  const [date, setDate] = useState<string>("");

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Set the value to today's date on component mount
  useEffect(() => {
    setDate(getTodayDate());
  }, []);
  const handleAddOrders = async () => {
    setProgressValue(50);
    if (await ADDNEWORDERS()) {
      setMessage("Orders Added Successfully");
      setTitle("Confirmation");
      setIsOpen(true);
    } else {
      setMessage("Failed To Add Orders Please Check file format");
      setTitle("Warning");
      setIsOpen(true);
    }

    setProgressValue(100);
  };
  const handleUpdateOrders = async () => {
    setProgressValue(50);
    if (await UPDATEORDERSTATUS(date)) {
      setMessage("Orders Updated Successfully");
      setTitle("Confirmation");
      setIsOpen(true);
    } else {
      setMessage("Failed To Update Orders Server Error");
      setTitle("Warning");
      setIsOpen(true);
    }

    setProgressValue(100);
  };

  return (
    <>
      <WarningModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
        imgLink={"img"}
        message={message}
        submitFuction={() => {}}
      />
      <NavigationMenuDemo />
      {progress < 100 && (
        <div className="w-full flex justify-center">
          <Progress value={progress} />
        </div>
      )}
      <div className="h-screen flex justify-center gap-20 items-center">
        <div className="grid grid-cols-2 gap-20 items-end w-2/5">
          <Button onClick={() => handleAddOrders()} variant={"default"}>
            Add Orders
          </Button>

          <div className="grid grid-cols-1 gap-10">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-md p-2"
            />
            <Button onClick={() => handleUpdateOrders()} variant={"default"}>
              Update Order Status
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
