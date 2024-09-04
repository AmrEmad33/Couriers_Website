"use client";
import { useEffect, useState } from "react";
import { NavigationMenuDemo } from "../components/nav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ADDNEWORDERS } from "../api/api";
import WarningModal from "../components/modal";

export default function AddOrderPage() {
  const [progress, setProgressValue] = useState(100);
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Please Close this window");
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
      <div className="h-screen flex justify-center items-center">
        <Button onClick={() => handleAddOrders()} variant={"default"}>
          Add Orders
        </Button>
      </div>
    </>
  );
}
