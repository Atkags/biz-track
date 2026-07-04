import { useState, useEffect } from "react";

function Products(){
  const[products, setProducts] = useState([]);
  const[error, setError] = useState(null)
  const[formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: 0,
    image: "null",
    is_active: true,
  });

  useEffect(() => {
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
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock_quantity", formData.stock_quantity);
    data.append("image", formData.image);
    data.append("is_active", formData.is_active);


    fetch("http://127.0.0.1:8000/api/products/", {
      method: 'POST',
      body: data,
    }).then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    }).then(dat => {
      console.log('Success', dat);
    }).catch(error => {
      console.error('Error:', error);
    })
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
            Add Product
          </button>
        </form>
      <h1>
        Products
      </h1>
      <ul>
        {products.map((product) => (
          <li key = {product.id}>
            <strong>
              {product.name} {product.description} {product.price} {product.stock_quantity} {product.image} {product.is_active}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
  
export default Products;