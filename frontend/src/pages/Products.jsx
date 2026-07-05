import { useState, useEffect } from "react";

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
    fetch("http://127.0.0.1:8000/api/products/", {
      method: 'GET'
    }).
    then((response) => response.json()).
    then((data) => {
      setProducts(data);
    })
    .catch((err) => {
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

    fetch(url, {
      method: method,
      body: data,
    }).then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(dat => {
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

    fetch(`http://127.0.0.1:8000/api/products/${product.id}/`,{
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    }).then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    }).then(dat => {
      fetchProducts();
      setEditingId(null);
    }).catch(error => 
      console.log("Error:", error)
    );
  }
  
  return(
    <div>
        <form onSubmit={handleSubmit}>

          <label>
            Product Name:
          </label>
          <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          } required>
          </input>

          <label>
            Description:
          </label>
          <textarea value={formData.description} placeholder="Product Desciption" onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }>
          </textarea>

          <label>
            Price:
          </label>
          <input type="number" step="0.01" min="0.00" max="99999999.99" value={formData.price} placeholder="0.00" onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          } required>
          </input>

          <label>
            Stock Quantity:
          </label>
          <input type="number" min="0" max="10000000" value={formData.stock_quantity}placeholder="0" onChange={(e) =>
            setFormData({
              ...formData,
              stock_quantity: e.target.value,
            })
          }>
          </input>

          <label>
            Product Image:
          </label>
          <input type="file" accept="image/jpg, image/jpeg, image/webp" onChange={(e) => 
          setFormData({
            ...formData,
            image: e.target.files[0],
          })
          }>
          </input>

          <label>
          <input type="checkbox" checked={formData.is_active} onChange={(e) =>
            setFormData({
              ...formData,
              is_active: e.target.checked,
            })
          }>
          </input>
          Is Product Active
          </label>
          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      <h1>
        Products
      </h1>
      <ul>
        {products.map((product) => (
          <li key = {product.id}>
            <img src={product.image} alt={product.name} />
            <strong>
              {product.name} <br /> {product.description} <br /> {product.price} <br /> {product.stock_quantity} <br /> {product.is_active}
            </strong>
            <button onClick={() => handleEdit(product)}>
              Edit
            </button>
            <button onClick={() => handleActive(product)}>
              {product.is_active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
  
export default Products;