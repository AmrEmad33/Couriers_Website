"use client";

import { GETORDERBYID } from "@/app/api/api";
import { OrderForm } from "@/app/components/orderForm";

export default function UpdateOrderPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <OrderForm id={params.slug} />
      </div>
    </div>
  );
}
