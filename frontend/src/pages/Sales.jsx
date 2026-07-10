import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";

function Sales() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    authFetch("http://127.0.0.1:8000/api/products/", {
      method: "GET",
    })
      .then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError("Couldn't connect to backend...");
      });
  }

  const filteredItems = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function addItem(product) {
    const existingItem = saleItems.find(
      (item) => item.product === product.id
    );

    if (existingItem) {
      setSaleItems(
        saleItems.map((item) =>
  
          item.product === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
      
    } else {
      setSaleItems([
        ...saleItems,
        {
          name: product.name,
          product: product.id,
          unit_price: product.price,
          quantity: 1,
        },
      ]);
      
    }
  }

  const total = saleItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price, 0
  )

  function completeSale() {
    if (saleItems.length === 0) {
      alert("Add at least one product.");
      return;
    }
    const payload = {
      sale_items: saleItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
      })),
    }; 

  authFetch("http://127.0.0.1:8000/api/sales/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      console.log("Success", data)

      setSaleItems([]);

      fetchProducts();
      setSearchQuery("");
    })
    .catch((error) => {
      setError(error.message);
    });
  }

  function increaseQuantity(productId) {
    setSaleItems(
      saleItems.map((item) =>
        item.product === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
  setSaleItems(
    saleItems
      .map((item) =>
        item.product === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
}

function removeItem(productId) {
  setSaleItems(
    saleItems.filter((item) => item.product !== productId)
  );
}

  return (
    <Layout>
      <h1>Sales</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Search Product"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul>
        {filteredItems.length > 0 ? (
          filteredItems.map((product) => (
            <li
              key={product.id}
              onClick={() => addItem(product)}
              style={{ cursor: "pointer" }}
            >
              <strong>{product.name}</strong> - ${product.price}
            </li>
          ))
        ) : (
          <li style={{ color: "red", fontStyle: "italic" }}>
            No products found
          </li>
        )}
      </ul>

      <h2>Current Sale</h2>

        <ul>
          {saleItems.map((item) => (
            <li key={item.product}>
              <strong>{item.name}</strong>

              <button onClick={() => decreaseQuantity(item.product)}>
                -
              </button>

              <span> {item.quantity} </span>

              <button onClick={() => increaseQuantity(item.product)}>
                +
              </button>

              <button onClick={() => removeItem(item.product)}>
                Remove
              </button>

              {" "} - ${(item.quantity * item.unit_price).toFixed(2)}
            </li>
          ))}
        </ul>
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={completeSale}>
          Complete Sale
        </button>
    </Layout>
  );
}

export default Sales;