"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ImagePlus, LogOut, Package, ShoppingBag, Trash2, Truck } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  productCollection: string;
  availability: "available" | "sold-out" | "unavailable";
};
type Order = {
  _id: string;
  reference: string;
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
    streetAddress: string;
    state: string;
  };
  total: number;
  paymentStatus: string;
  fulfilmentStatus: string;
  items: { name: string; quantity: number }[];
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [sendingOrderId, setSendingOrderId] = useState<string | null>(null);
  const [shippingRates, setShippingRates] = useState({
    mainland: 3500,
    island: 5000,
    outsideLagos: 7000,
  });
  useEffect(() => {
    const savedToken = window.localStorage.getItem("admin-token") || "";
    const timer = window.setTimeout(() => setToken(savedToken), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, []);
  const load = useCallback(
    async (auth = token) => {
      if (!auth) return;
      const headers = { Authorization: `Bearer ${auth}` };
      const [productData, orderData, shippingData] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/admin/orders", { headers }).then((r) => r.json()),
        fetch("/api/admin/shipping", { headers }).then((r) => r.json()),
      ]);
      setProducts(productData);
      setOrders(Array.isArray(orderData) ? orderData : []);
      if (shippingData?.rates) setShippingRates(shippingData.rates);
    },
    [token],
  );
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);
  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.message);
    localStorage.setItem("admin-token", data.token);
    setToken(data.token);
    setMessage("Signed in.");
    load(data.token);
  };
  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: new FormData(form),
    });
    setMessage(response.ok ? "Product added." : "Could not add product.");
    if (response.ok) {
      form.reset();
      load();
    }
  };
  const updateAvailability = async (id: string, availability: string) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ availability }),
    });
    load();
  };
  const removeProduct = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };
  const sendDelivery = async (id: string) => {
    setSendingOrderId(id);
    try {
      const response = await fetch(`/api/admin/orders/${id}/delivery`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      setMessage(
        response.ok ? "Delivery email sent." : data.message ?? "Could not send delivery email.",
      );
      if (response.ok) await load();
    } catch {
      setMessage("Could not send delivery email. Please try again.");
    } finally {
      setSendingOrderId(null);
    }
  };
  const saveShipping = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        mainland: form.get("mainland"),
        island: form.get("island"),
        outsideLagos: form.get("outsideLagos"),
      }),
    });
    setMessage(response.ok ? "Delivery prices updated." : "Could not update delivery prices.");
    if (response.ok) load();
  };
  const successfulOrders = orders.filter((order) => order.paymentStatus === "successful");
  const customerOrders = orders.filter((order) => order.fulfilmentStatus !== "sent-for-delivery");
  const sentOrders = orders.filter((order) => order.fulfilmentStatus === "sent-for-delivery");
  if (!token)
    return (
      <main className="adminPage">
        <form className="adminLogin" method="post" onSubmit={login}>
          <h1>Admin Login</h1>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required />
          </label>
          <button>Sign in</button>
          <p>{message}</p>
        </form>
      </main>
    );
  return (
    <main className="adminPage">
      <header className="adminHeader">
        <div>
          <p>Kaylash Beauty Place</p>
          <h1>Store dashboard</h1>
        </div>
        <button
          className="adminSignOut"
          onClick={() => {
            localStorage.removeItem("admin-token");
            setToken("");
          }}
        >
          <LogOut size={15} /> Sign out
        </button>
      </header>
      {message && <p className="adminMessage">{message}</p>}
      <section className="adminStats">
        <div>
          <Package size={20} />
          <span>
            <strong>{products.length}</strong> Products
          </span>
        </div>
        <div>
          <ShoppingBag size={20} />
          <span>
            <strong>{orders.length}</strong> Total orders
          </span>
        </div>
        <div>
          <CheckCircle2 size={20} />
          <span>
            <strong>{successfulOrders.length}</strong> Paid orders
          </span>
        </div>
      </section>
      <section className="adminGrid">
        <form className="adminCard adminProductForm" onSubmit={addProduct}>
          <div className="adminCardHeading">
            <div>
              <p>Catalogue</p>
              <h2>Add a product</h2>
            </div>
            <ImagePlus size={21} />
          </div>
          <label className="adminField">
            Name
            <input name="name" required />
          </label>
          <label className="adminField">
            Price
            <input name="price" type="number" min="0" required />
          </label>
          <div className="adminFieldRow">
            <label className="adminField">
              Collection
              <select name="productCollection">
                <option value="lipgloss">Lipgloss</option>
                <option value="lip-care">Lip Care</option>
              </select>
            </label>
            <label className="adminField">
              Availability
              <select name="availability">
                <option value="available">Available</option>
                <option value="sold-out">Sold out</option>
                <option value="unavailable">Not available</option>
              </select>
            </label>
          </div>
          <label className="adminUpload">
            <ImagePlus size={20} />
            <span>
              <strong>Upload product image</strong>
              <small>JPG, PNG or WebP · up to 5MB</small>
            </span>
            Product image
            <input name="image" type="file" accept="image/*" required />
          </label>
          <button className="adminPrimaryButton">
            <ImagePlus size={16} /> Add product
          </button>
        </form>
        <section className="adminCard adminProductsCard">
          <div className="adminCardHeading">
            <div>
              <p>Catalogue</p>
              <h2>Your products</h2>
            </div>
            <span className="adminCount">{products.length}</span>
          </div>
          <div className="adminProductsList">
            {products.length ? (
              products.map((product) => (
                <article className="adminProductRow" key={product._id}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={56}
                    height={56}
                    unoptimized
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      ₦{product.price.toLocaleString("en-NG")} · {product.productCollection}
                    </span>
                  </div>
                  <select
                    value={product.availability}
                    onChange={(event) => updateAvailability(product._id, event.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="sold-out">Sold out</option>
                    <option value="unavailable">Not available</option>
                  </select>
                  <button
                    className="adminDeleteButton"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => removeProduct(product._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))
            ) : (
              <p className="adminEmpty">Your uploaded products will appear here.</p>
            )}
          </div>
        </section>
      </section>
      <form className="adminCard adminShippingForm" onSubmit={saveShipping}>
        <div className="adminCardHeading">
          <div>
            <p>Delivery settings</p>
            <h2>Current delivery prices</h2>
          </div>
          <Truck size={21} />
        </div>
        <div className="adminFieldRow">
          <label className="adminField">
            Lagos Mainland
            <input name="mainland" type="number" min="0" defaultValue={shippingRates.mainland} />
          </label>
          <label className="adminField">
            Lagos Island
            <input name="island" type="number" min="0" defaultValue={shippingRates.island} />
          </label>
          <label className="adminField">
            Outside Lagos
            <input
              name="outsideLagos"
              type="number"
              min="0"
              defaultValue={shippingRates.outsideLagos}
            />
          </label>
        </div>
        <button className="adminPrimaryButton">Save delivery prices</button>
      </form>
      <section className="adminCard adminOrders">
        <div className="adminCardHeading">
          <div>
            <p>Fulfilment</p>
            <h2>Customer orders</h2>
          </div>
          <Truck size={21} />
        </div>
        {customerOrders.length ? (
          customerOrders.map((order) => (
            <article className="orderRow" key={order._id}>
              <div>
                <strong>{order.reference}</strong>
                <p>
                  {order.customer.fullName} · {order.customer.phoneNumber} · {order.customer.email}
                </p>
                <p>
                  {order.customer.streetAddress}, {order.customer.state}
                </p>
                <p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
              </div>
              <div>
                <strong>₦{order.total}</strong>
                <p className={`paymentStatus ${order.paymentStatus}`}>
                  Payment: {order.paymentStatus}
                </p>
                <button
                  type="button"
                  className="adminDeliveryButton"
                  disabled={order.paymentStatus !== "successful" || sendingOrderId === order._id}
                  onClick={() => sendDelivery(order._id)}
                >
                  {sendingOrderId === order._id ? "Sending email…" : "Send for delivery"}
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="adminEmpty">
            Paid customer orders will appear here after Bachs confirms payment.
          </p>
        )}
      </section>
      <section className="adminCard adminOrders">
        <div className="adminCardHeading">
          <div>
            <p>Fulfilment</p>
            <h2>Orders sent</h2>
          </div>
          <Truck size={21} />
        </div>
        {sentOrders.length ? (
          sentOrders.map((order) => (
            <article className="orderRow" key={order._id}>
              <div>
                <strong>{order.reference}</strong>
                <p>
                  {order.customer.fullName} · {order.customer.phoneNumber} · {order.customer.email}
                </p>
                <p>
                  {order.customer.streetAddress}, {order.customer.state}
                </p>
                <p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
              </div>
              <div>
                <strong>₦{order.total}</strong>
                <p className="paymentStatus successful">Payment: successful</p>
                <p className="deliveryStatus">Sent for delivery</p>
              </div>
            </article>
          ))
        ) : (
          <p className="adminEmpty">Orders sent to customers will appear here.</p>
        )}
      </section>
    </main>
  );
}
