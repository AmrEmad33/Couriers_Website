"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  GETALLCOURIERS,
  GETORDERBYID,
  ordersProps,
  UPDATEORDER,
  usersProps,
} from "../api/api";
import ErrorModal from "./errorModal";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  id: z.string(),
  phone_number: z.string(),
  mapLink: z.string().min(1, { message: "Location is required." }),
  order_date: z.string().min(1, { message: "Date is required." }),
  customer_name: z.string().min(1, { message: "Customer Name is required." }),
  courier_name: z.string().min(1, { message: "Courier Name is required." }),
  domestic_zone: z.string().min(1, { message: "Zone is required." }),
  arabic_location: z
    .string()
    .min(1, { message: "Arabic Location is required." }),
  payment_method: z.string().min(1, { message: "Payment Method is required." }),
  is_delivered: z.number().min(0).max(1),
  total: z.number().min(1, { message: "total must be a positive number." }),
  delivery_fee: z
    .number()
    .min(1, { message: "total must be a positive number." }),
  notes: z.string(),
});

interface orderFormProps {
  id: string;
}

export function OrderForm({ id }: orderFormProps) {
  const [order, setOrder] = useState<ordersProps | null>(null);
  const [progressBar, setProgressBar] = useState<number>(0);
  const [couriers, setCouriers] = useState<usersProps[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<usersProps>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      setProgressBar(20);
      const allCouriers = await GETALLCOURIERS();

      setProgressBar(90);
      const fetchedOrder = await GETORDERBYID(id);
      if (fetchedOrder == null) {
        console.log("null");
        setIsOpen(true);
        setMessage("Failed To get This order");
        setTitle("Error");
        return;
      }
      setOrder(fetchedOrder);
      setCouriers(allCouriers);

      const matchedCourier = allCouriers.find(
        (courier) => courier.id === fetchedOrder.courier_id
      );
      setSelectedCourier(matchedCourier);

      const orderDate = new Date(fetchedOrder.order_date);
      const formattedDate = format(orderDate, "yyyy-MM-dd");

      form.reset({
        id: id || "",
        phone_number: fetchedOrder.phone_number || "",
        customer_name: fetchedOrder.customer_name || "",
        courier_name: matchedCourier?.name || "", // Ensure this is set
        domestic_zone: fetchedOrder.domestic_zone || "",
        arabic_location: fetchedOrder.arabic_location || "",
        payment_method: fetchedOrder.payment_method || "",
        is_delivered: fetchedOrder.is_delivered || 0,
        total: fetchedOrder.total || 0,
        order_date: formattedDate,
        mapLink: fetchedOrder.mapLink,
        delivery_fee: fetchedOrder.delivery_fee,
        notes: fetchedOrder.notes,
      });
      setProgressBar(100);
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id || "",
      phone_number: order?.phone_number || "",
      customer_name: order?.customer_name || "",
      courier_name: order?.courier_name || "",
      domestic_zone: order?.domestic_zone || "",
      arabic_location: order?.arabic_location || "",
      payment_method: order?.payment_method || "",
      is_delivered: order?.is_delivered || 0, // Ensure is_delivered is treated as a number
      total: order?.total || 0,
      order_date: order ? format(new Date(order.order_date), "yyyy-MM-dd") : "",
      mapLink: order?.mapLink,
      delivery_fee: order?.delivery_fee,
      notes: order?.notes,
    },
  });

  const handleCourierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchedCourier = couriers.find(
      (courier) => courier.name === event.target.value
    );
    setSelectedCourier(matchedCourier);
    form.setValue("courier_name", event.target.value);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formattedDate = format(new Date(values.order_date), "MMMM dd, yyyy");
    const formattedValues = {
      ...values,
      courier_id: selectedCourier?.id,
      order_date: formattedDate,
    } as ordersProps;
    console.log(formattedValues);
    const errored = (await UPDATEORDER(formattedValues)) as boolean;
    console.log("in submit");
    if (errored) {
      console.log("not Error");
      router.push("/");
    } else {
      console.log("error");
      setMessage("Failed Updating orders");
      setTitle("Error");
      setIsOpen(true);
    }
  };
  if (loading) {
    return (
      <>
        <ErrorModal
          isOpen={isOpen}
          title={title}
          imgLink={""}
          message={message}
          setIsOpen={setIsOpen}
        />
        <Progress value={progressBar} />
      </>
    );
  }
  return (
    <Form {...form}>
      <ErrorModal
        isOpen={isOpen}
        title={title}
        imgLink={""}
        message={message}
        setIsOpen={setIsOpen}
      />
      <div>
        <p className="py-5 flex justify-center">Update Order</p>
      </div>
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Id</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="order_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Customer Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="courier_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Courier</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={handleCourierChange}
                      value={selectedCourier?.name}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Courier</option>
                      {couriers.map((courier) => (
                        <option key={courier.id} value={courier.name}>
                          {courier.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="domestic_zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Zone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="arabic_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Arabic Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="mapLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Location Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Payment Method" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="is_delivered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === "Delivered" ? 1 : 0)
                      }
                      value={field.value === 1 ? "Delivered" : "Pending"}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Amount"
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="delivery_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Fees</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Delivery fees"
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="mt-10 " type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
