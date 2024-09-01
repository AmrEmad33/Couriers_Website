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
import { Copy } from "lucide-react";
interface DialogProps {
  isOpen: boolean;
  title: string;
  imgLink: string;
  message: string;
  setIsOpen: (isOpen: boolean) => void;
  submitFuction: () => void;
}
export default function WarningModal({
  isOpen,
  title,
  imgLink,
  message,
  setIsOpen,
  submitFuction,
}: DialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        {/* <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <label htmlFor="link" className="sr-only">
              Link
            </label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div> */}
        {/* <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button> */}
        {/* </div> */}
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant="secondary"
          >
            Close
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => submitFuction()}
              variant="default"
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
