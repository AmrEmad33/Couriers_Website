var URL = "https://vikive3096.pythonanywhere.com/";
var localURL = "http://localhost:5000/";
export async function GETALLORDERS(): Promise<ordersProps[]> {
  const res = await fetch(URL + "api/orders/getOrders");
  const data = await res.json();
  const result = data["allOrders"] as ordersProps[];
  console.log(result);
  return result;
}
export async function GETALLCOURIERS(): Promise<usersProps[]> {
  try {
    const res = await fetch(URL + "api/roles/getByName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed, like authentication headers
      },
      // Include a body if needed; for this example, it’s empty
      body: JSON.stringify({
        name: "Courier",
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    const result = data["role"] as roleProps;
    console.log(result);

    const res2 = await fetch(URL + "api/auth/getUsersByRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed, like authentication headers
      },
      // Include a body if needed; for this example, it’s empty
      body: JSON.stringify({
        id: result.id,
      }),
    });
    console.log("ok");
    if (!res2.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data2 = await res2.json();
    const result2 = data2["users"] as usersProps[];
    console.log(result2);
    return result2;
  } catch (error) {
    console.error("Failed to fetch couriers:", error);
    return [];
  }
}
export async function DELETEORDERS(selectedItems: string[]) {
  console.log(selectedItems);

  try {
    const res = await fetch(URL + "api/orders/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: selectedItems,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch couriers:", error);
    return [];
  }
}
export async function TransferOrders(allOrders: ordersProps[]) {
  try {
    const res = await fetch(URL + "api/orders/bulkUpdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orders: allOrders,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to update orders:", error);
    throw new Error(`HTTP error! Status: ${error}`);
  }
}
export interface ordersProps {
  id: string;
  courier_id: number;
  customer_name: string;
  phone_number: string;
  delivery_fee: number;
  is_delivered: number;
  total: number;
  payment_method: string;
  arabic_location: string;
  domestic_zone: string;
  mapLink: string;
  order_date: string;
  courier_name: string;
}

export interface roleProps {
  id: number;
  name: string;
}

export interface usersProps {
  id: number;
  name: string;
  email: string;
  role_id: number;
}
