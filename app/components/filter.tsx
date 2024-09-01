import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust imports as needed
import { Calendar } from "lucide-react"; // For date icon, install lucide-react
import { Input } from "@/components/ui/input";

const DateFilter = ({ onFilter }: { onFilter: (date: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleFilter = () => {
    onFilter(selectedDate);
  };

  return (
    <div className="flex items-center space-x-4">
      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border rounded-md p-2"
      />
      <Button
        onClick={handleFilter}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Calendar className="h-4 w-4" />
        <span>Filter by Date</span>
      </Button>
    </div>
  );
};

export default DateFilter;
