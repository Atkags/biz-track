import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";

function Purchases() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [purchaseItems, setPurchaseItems] = useState([]);
  const [purchaseDb, setPurchaseDb] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  function fetchProducts() {
  authFetch("http://127.0.0.1:8000/api/products/")
    .then((response) => response.json())
    .then((data) => setProducts(data));
}

  function fetchSuppliers() {
  authFetch("http://127.0.0.1:8000/api/suppliers/")
    .then((response) => response.json())
    .then((data) => setSuppliers(data));
}

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function completePurchase() {
    if (purchaseItems.length === 0) {
      alert("Add at least one product.");
      return;
    }
    const payload = 
      purchaseItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }))
      ; 

    authFetch("http://127.0.0.1:8000/api/purchases/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supplier: selectedSupplier,
        purchase_items: payload,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! ${response.status}`);
        }

        return response.json();
      })
      .then(() => {
        setPurchaseItems([]);
        setPurchaseDb([]);
        setSelectedSupplier("");

        fetchProducts();
      })
      .catch(console.error);
  }

  function addItem(product) {
    const existingItem = purchaseItems.find(
      (item) => item.product === product.id
    );

    if (existingItem) {
      setPurchaseItems(
        purchaseItems.map((item) =>
  
          item.product === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
      
    } else {
      setPurchaseItems([
        ...purchaseItems,
        {
          name: product.name,
          product: product.id,
          unit_price: product.price,
          quantity: 1,
        },
      ]);
      
    }

  }
  function increaseQuantity(productId) {
    setPurchaseItems(
      purchaseItems.map((item) =>
        item.product === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setPurchaseItems(
      purchaseItems
        .map((item) =>
          item.product === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(productId) {
    setPurchaseItems(
      purchaseItems.filter((item) => item.product !== productId)
    );
  }

  return(
    <Layout>
      <select
        value={selectedSupplier}
        onChange={(e) => setSelectedSupplier(e.target.value)}
      >
        <option value="">Select Supplier</option>

        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search Product"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul>
        {filteredProducts.map((product) => (
          <li
            key={product.id}
            onClick={() => addItem(product)}
            style={{ cursor: "pointer" }}
          >
            <strong>{product.name}</strong>
            {" - $"}
            {product.price}
            {" | Stock: "}
            {product.stock_quantity}
          </li>
        ))}
      </ul>

      <ul>
        {purchaseItems.map((item, index) => (
          <li key={index}>

            {item.name} × 
            <button onClick={() => decreaseQuantity(item.product)}>
                -
            </button>
            {item.quantity}
            <button onClick={() => increaseQuantity(item.product)}>
                +
            </button>
             - ${item.unit_price}
            <button onClick={() => removeItem(item.product)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h3>
        Total: $
        {purchaseItems
          .reduce(
            (sum, item) => sum + item.quantity * item.unit_price,
            0
          )
          .toFixed(2)}
      </h3>

      <button
        onClick={completePurchase}
        disabled={
          purchaseItems.length === 0 || selectedSupplier === ""
        }
      >
        Complete Purchase
      </button>
    </Layout>
  )


}

export default Purchases;