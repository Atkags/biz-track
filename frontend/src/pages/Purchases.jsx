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
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchases</h1>
          <p className="page-subtitle">Record new purchases and manage supplier orders efficiently.</p>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel-card">
          <div className="section-header">
            <h2 className="section-title">Supplier & Products</h2>
            <span className="section-badge">{filteredProducts.length} products</span>
          </div>

          <div className="field-group">
            <label className="field-label">Select Supplier</label>
            <select
              className="field-select"
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
          </div>

          <div className="field-group" style={{ marginTop: "12px" }}>
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
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                onClick={() => addItem(product)}
                style={{ cursor: "pointer" }}
              >
                <div className="list-main">
                  <div className="list-title">{product.name}</div>
                  <div className="list-meta">${product.price} • Stock {product.stock_quantity}</div>
                </div>
                <span className="section-badge">Add</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel-card">
          <div className="section-header">
            <h2 className="section-title">Purchase Order</h2>
            <span className="section-badge">{purchaseItems.length} items</span>
          </div>

          <ul className="data-list">
            {purchaseItems.map((item, index) => (
              <li key={index}>
                <div className="list-main">
                  <div className="list-title">{item.name}</div>
                  <div className="list-meta">${item.unit_price}</div>
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
            <span>${purchaseItems
              .reduce(
                (sum, item) => sum + item.quantity * item.unit_price,
                0
              )
              .toFixed(2)}</span>
          </div>

          <div className="form-actions" style={{ marginTop: "16px" }}>
            <button
              className="btn btn-primary"
              onClick={completePurchase}
              disabled={
                purchaseItems.length === 0 || selectedSupplier === ""
              }
            >
              Complete Purchase
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )


}

export default Purchases;