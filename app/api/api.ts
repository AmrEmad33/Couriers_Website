var deployedUrl = "https://xomehim229.pythonanywhere.com/";
var localUrl = "http://localhost:5000/";
var URL = deployedUrl;
export async function UPDATEORDERSTATUS(chosenDate: string): Promise<Boolean> {
  try {
    const res = await fetch(URL + "api/orders/updateOrdersInGoogleSheet", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: chosenDate,
      }),
    });
    if (!res.ok) {
      console.log(`HTTP error! Status: ${res.status}`);
      return false;
    }
    const data = await res.json();
    console.log(data);
    return true;
  } catch (error) {
    console.log("Failed to Update Order Status:", error);
    return false;
  }
}
export async function UPDATEORDER(order: ordersProps): Promise<Boolean> {
  try {
    const res = await fetch(URL + "api/orders/updateOrder", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: order,
      }),
    });

    if (!res.ok) {
      console.log(`HTTP error! Status: ${res.status}`);
      return false;
    }
    const data = await res.json();
    console.log(data);
    return true;
  } catch (error) {
    console.log("Failed to fetch couriers:", error);
    return false;
  }
}
export async function GETORDERBYID(orderId: string): Promise<ordersProps> {
  try {
    const res = await fetch(URL + "api/orders/get/" + orderId);
    const data = await res.json();
    const result = data["order"] as ordersProps;
    // console.log("data");
    // console.log("result " + JSON.stringify(result));
    return result;
  } catch (error) {
    return { id: "" } as ordersProps;
  }
}
export async function GETALLORDERS(): Promise<ordersProps[]> {
  const res = await fetch(URL + "api/orders/getOrders");
  const data = await res.json();
  const result = data["allOrders"] as ordersProps[];
  // console.log(result);
  return result;
}
export async function ADDNEWORDERS(): Promise<boolean> {
  try {
    const res = await fetch(URL + "api/orders/addBulkOrders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed, like authentication headers
      },
      // Include a body if needed; for this example, it’s empty
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return true;
  } catch (e) {
    console.error("Failed to fetch couriers:", e);
    return false;
  }
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
    // console.log(result);

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
  notes: string;
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
export const getFormattedDate = () => {
  const today = new Date();
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Cairo",
  }).format(today);
};
