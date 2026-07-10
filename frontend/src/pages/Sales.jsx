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
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales</h1>
          <p className="page-subtitle">Create quick sales and review the current order before checkout.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="panel-grid">
        <div className="panel-card">
          <div className="section-header">
            <h2 className="section-title">Catalog</h2>
            <span className="section-badge">{filteredItems.length} items</span>
          </div>

          <div className="field-group">
            <label className="field-label">Search products</label>
            <input
              className="field-input search-input"
              type="text"
              placeholder="Search Product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="data-list" style={{ marginTop: "12px" }}>
            {filteredItems.length > 0 ? (
              filteredItems.map((product) => (
                <li
                  key={product.id}
                  onClick={() => addItem(product)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="list-main">
                    <div className="list-title">{product.name}</div>
                    <div className="list-meta">${product.price}</div>
                  </div>
                  <span className="section-badge">Add</span>
                </li>
              ))
            ) : (
              <li className="empty-state">No products found</li>
            )}
          </ul>
        </div>

        <div className="panel-card">
          <div className="section-header">
            <h2 className="section-title">Current Sale</h2>
            <span className="section-badge">{saleItems.length} items</span>
          </div>

          <ul className="data-list">
            {saleItems.map((item) => (
              <li key={item.product}>
                <div className="list-main">
                  <div className="list-title">{item.name}</div>
                  <div className="list-meta">${(item.quantity * item.unit_price).toFixed(2)}</div>
                </div>
                <div className="item-actions">
                  <button className="btn btn-secondary" onClick={() => decreaseQuantity(item.product)}>
                    -
                  </button>
                  <span className="quantity-pill">{item.quantity}</span>
                  <button className="btn btn-secondary" onClick={() => increaseQuantity(item.product)}>
                    +
                  </button>
                  <button className="btn btn-danger" onClick={() => removeItem(item.product)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="total-card" style={{ marginTop: "16px" }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="form-actions" style={{ marginTop: "16px" }}>
            <button className="btn btn-primary" onClick={completeSale}>
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Sales;