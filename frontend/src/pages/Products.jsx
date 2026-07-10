import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";

function Products(){
  const[products, setProducts] = useState([]);
  const[error, setError] = useState(null);
  const[formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: 0,
    image: "null",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts(){
    authFetch("http://127.0.0.1:8000/api/products/", {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }).
    then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    }).
    then((data) => {
      setProducts(data);
    })
    .catch(() => {
      setError("Couldnt connect to backend...");
    });

    
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock_quantity", formData.stock_quantity);
    if(formData.image){
      data.append("image", formData.image);
    }
    data.append("is_active", formData.is_active);

    const url = editingId
        ? `http://127.0.0.1:8000/api/products/${editingId}/`
        : `http://127.0.0.1:8000/api/products/`;

    const method = editingId ? "PUT" : "POST";

    authFetch(url, {
      method: method,
      body: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }).then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchProducts();
      setFormData({
      name: "",
      description: "",
      price: "",
      stock_quantity: 0,
      image: null,
      is_active: true,
    });
      setEditingId(null);
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        image: null,
        is_active: product.is_active,
    });
  }

  function handleCancel() {
    setEditingId(null);

    setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: 0,
        image: null,
        is_active: true,
    });
  }

  function handleActive(product){
    const newStatus = !product.is_active;

    const data = {
      is_active: newStatus,
    }

    authFetch(`http://127.0.0.1:8000/api/products/${product.id}/`,{
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    }).then(() => {
      fetchProducts();
      setEditingId(null);
    }).catch(() => 
      console.log("Error:", error)
    );
  }
  
  return(
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage inventory, pricing, and product availability in one place.</p>
        </div>
      </div>

      <div className="panel-grid">
        <form className="panel-card form-grid" onSubmit={handleSubmit}>
          <div className="section-header">
            <h2 className="section-title">{editingId ? "Edit Product" : "Add Product"}</h2>
            <span className="section-badge">{editingId ? "Editing" : "New entry"}</span>
          </div>

          <div className="field-group">
            <label className="field-label">Product Name</label>
            <input className="field-input" type="text" placeholder="Product Name" value={formData.name} onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            } required />
          </div>

          <div className="field-group">
            <label className="field-label">Description</label>
            <textarea className="field-textarea" value={formData.description} placeholder="Product Description" onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }></textarea>
          </div>

          <div className="field-group">
            <label className="field-label">Price</label>
            <input className="field-input" type="number" step="0.01" min="0.00" max="99999999.99" value={formData.price} placeholder="0.00" onChange={(e) =>
              setFormData({
                ...formData,
                price: e.target.value,
              })
            } required />
          </div>

          <div className="field-group">
            <label className="field-label">Stock Quantity</label>
            <input className="field-input" type="number" min="0" max="10000000" value={formData.stock_quantity} placeholder="0" onChange={(e) =>
              setFormData({
                ...formData,
                stock_quantity: e.target.value,
              })
            } />
          </div>

          <div className="field-group">
            <label className="field-label">Product Image</label>
            <input className="field-input" type="file" accept="image/jpg, image/jpeg, image/webp" onChange={(e) => 
            setFormData({
              ...formData,
              image: e.target.files[0],
            })
            } />
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={formData.is_active} onChange={(e) =>
              setFormData({
                ...formData,
                is_active: e.target.checked,
              })
            } />
            <span>Is Product Active</span>
          </label>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="data-card">
          <div className="section-header" style={{ padding: "16px 16px 0" }}>
            <h2 className="section-title">Inventory</h2>
            <span className="section-badge">{products.length} products</span>
          </div>

          <ul className="data-list">
            {products.map((product) => (
              <li key={product.id}>
                <div className="list-main" style={{ flexDirection: "row", alignItems: "center", gap: "12px" }}>
                  {product.image ? (
                    <img className="product-thumb" src={product.image} alt={product.name} />
                  ) : (
                    <div className="product-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>IMG</div>
                  )}
                  <div className="list-main">
                    <div className="list-title">{product.name}</div>
                    <div className="list-meta">{product.description || "No description provided"}</div>
                    <div className="list-meta">${product.price} • Stock {product.stock_quantity} • {product.is_active ? "Active" : "Inactive"}</div>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn btn-secondary" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className={`btn ${product.is_active ? "btn-danger" : "btn-primary"}`} onClick={() => handleActive(product)}>
                    {product.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {!products.length && <div className="empty-state">No products yet.</div>}
        </div>
      </div>
    </Layout>
  );
}
  
export default Products;