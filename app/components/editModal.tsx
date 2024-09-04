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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import React, { useState } from "react";
import { CustomCombobox } from "./comboBox";
import { usersProps } from "../api/api";

export interface editTableProps {
  customer_name: string;
  courier_name: string;
  zone: string;
  arabic_location: string;
  method: string;
  status: number;
  amount: number;
}

interface EditDialogProps {
  editData: editTableProps;
  onSave: (updatedCourier: EditDialogProps["editData"]) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  courierData: usersProps[];
  setCourier: (courier: usersProps) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  editData,
  onSave,
  isOpen,
  setIsOpen,
  courierData,
  setCourier,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<editTableProps>(editData);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(formData);
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Courier Details</DialogTitle>
          <DialogDescription>
            Update the courier's information below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Customer Name"
            name="customername"
            value={editData.customer_name}
            onChange={handleChange}
          />
          <CustomCombobox
            listOfData={courierData}
            title={""}
            setData={setCourier}
          ></CustomCombobox>
          <Input
            placeholder="Zone"
            name="zone"
            value={editData.zone}
            onChange={handleChange}
          />
          <Input
            placeholder="Arabic Location"
            name="arabicLocation"
            value={editData.arabic_location}
            onChange={handleChange}
          />
          <Input
            placeholder="Payment Method"
            name="paymentMethod"
            value={editData.method}
            onChange={handleChange}
          />

          <Input
            placeholder="Amount"
            name="amount"
            type="number"
            value={editData.amount}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleSave}>
            Save
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
