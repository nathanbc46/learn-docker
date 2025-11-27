<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Product {
  id: number
  name: string
  description: string
  price: number
  createdAt: string
  updatedAt: string
}

const products = ref<Product[]>([])
const input = ref({
  name: '',
  price: 0
})

async function fetchProducts() {
  const { data } = await fetch('http://localhost:3000/products').then(res => res.json()) as { data: Product[] }
  products.value = data
}

async function createProduct(name: string, price: number) {
  await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price })
  })
  await fetchProducts()
}

async function onSubmit() {
  await createProduct(input.value.name, input.value.price)
  input.value.name = ''
  input.value.price = 0
}

onMounted(() => {
  fetchProducts()
})

</script>
<template>
  <div>
    <h1>Product List</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        <p>{{ product.name }}</p>
        <p>{{ product.description }}</p>
        <p>Price: ${{ product.price }}</p>
        <p>Created At: {{ product.createdAt }}</p>
        <p>Updated At: {{ product.updatedAt }}</p>
      </li>
    </ul>
    <hr />
    <h2>Add New Product</h2>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="name">Name</label> <input type="text" name="name" v-model="input.name" placeholder="Product Name"
          required />
      </div>
      <div>
        <label for="price">Price</label> <input type="number" name="price" v-model="input.price"
          placeholder="Product Price" required />
      </div>
      <button type="submit">Add Product</button>
    </form>
  </div>
</template>