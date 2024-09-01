import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomCombobox } from "./comboBox";
import { usersProps } from "../api/api";

interface DialogProps {
  isOpen: boolean;
  title: string;
  imgLink: string;
  message: string;
  setIsOpen: (isOpen: boolean) => void;
  comboBoxData: usersProps[];
  setCourier: (courier: usersProps) => void;
  submitFuction: () => void;
  courier: usersProps;
}

export function TransferModal({
  comboBoxData,
  isOpen,
  title,
  imgLink,
  message,
  setIsOpen,
  submitFuction,
  setCourier,
  courier,
}: DialogProps) {
  const [selectedCourier, setSelectedCourier] = useState<usersProps | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Handle saving with validation
  const handleSave = () => {
    if (selectedCourier && selectedCourier.name === courier.name) {
      // Replace 'desiredName' with the actual condition
      submitFuction();
      setIsOpen(false);
    } else {
      setError("Please Select a value.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 items-center">
          <div className="w-full flex justify-center items-center gap-4">
            <CustomCombobox
              setData={(courier) => {
                setCourier(courier);
                setSelectedCourier(courier);
              }}
              listOfData={comboBoxData}
              title={"Courier"}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display validation error */}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant={"secondary"}
          >
            Close
          </Button>
          <Button onClick={handleSave} type="button">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
