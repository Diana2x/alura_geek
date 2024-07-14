const addProductForm = document.getElementById("add_product-form");
addProductForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const productName = document.getElementById("product-name").value.trim();
  const productDescription = document
    .getElementById("product-description")
    .value.trim();
  const productPrice = parseFloat(
    document.getElementById("product-price").value.trim()
  );
  const productImage = document.getElementById("product-image").value.trim();

  if (
    !productName ||
    !productDescription ||
    isNaN(productPrice) ||
    !productImage
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const newProduct = {
    name: productName,
    description: productDescription,
    price: productPrice,
    image: productImage,
  };

  try {
    const response = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error("Failed to add product.");
    }

    console.log("Product added successfully:", newProduct);
    displayProducts(); // Refresh products after adding
    addProductForm.reset(); // Clear form inputs
  } catch (error) {
    console.error("Error adding product:", error);
  }
});

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3001/products");
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Display products in the UI
async function displayProducts() {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = ""; // Clear previous content

  const products = await fetchProducts();
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product-item");
    productElement.innerHTML = `
      <img src="${product.image}" width="100" height="100" />
      <p><strong>${product.name}</strong></p>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <button class="delete-product" data-id="${product.id}">Delete</button>
    `;
    productsContainer.appendChild(productElement);

    const deleteButton = productElement.querySelector(".delete-product");
    deleteButton.addEventListener("click", async () => {
      await deleteProduct(product.id);
      displayProducts(); // Refresh products after deletion
    });
  });
}

// Delete a product by ID
async function deleteProduct(productId) {
  try {
    await fetch(`http://localhost:3001/products/${productId}`, {
      method: "DELETE",
    });
    console.log(`Product with ID ${productId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
  }
}

// Initial display of products when the page loads
displayProducts();
