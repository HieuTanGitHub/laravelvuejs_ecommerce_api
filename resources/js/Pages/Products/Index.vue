<template>
    <div>
        <Menu></Menu>
        <div class="container mx-auto p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Products</h1>
            <!-- Add Product Button -->
            <button @click="openProductModal()" class="bg-teal-500 text-dark px-4 py-2 rounded mb-4">
                Add Product
            </button>
            <!-- View Cart Button -->
            <button @click="openCartModal()" class="bg-blue-500 text-dark px-4 py-2 rounded mb-4">
                View Cart
            </button>
            <div v-if="loading" class="text-center text-blue-600">Loading products...</div>
            <div v-else>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="product in products" :key="product.id" class="border rounded-lg p-4 shadow-lg">
                        <img :src="product.img_url" alt="Product image" class="w-full h-48 object-cover mb-4">
                        <h2 class="text-xl font-semibold">{{ product.name }}</h2>
                        <p class="text-sm text-gray-600">{{ product.description }}</p>
                        <div class="mt-4">
                            <p class="font-bold text-teal-500">{{ product.price }}</p>
                            <p class="text-gray-500">Category: {{ product.category?.name }}</p>
                            <p class="text-gray-500">Brand: {{ product.brand?.name }}</p>
                        </div>
                        <!-- Edit Button -->
                        <button @click="openProductModal(product)" class="bg-yellow-500 text-dark px-4 py-2 rounded">
                            Edit
                        </button>
                        <!-- Delete Button -->
                        <button @click="deleteProduct(product.id)" class="bg-red-500 text-white px-4 py-2 rounded">
                            Delete
                        </button>
                        <div class="mt-4">
                            <button @click="addToCart(product)" class="bg-teal-500 text-dark px-4 py-2 rounded">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Cart Modal -->
            <div v-if="isCartModalOpen" @click.self="closeCartModal"
                class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div class="bg-white p-6 rounded shadow-lg w-1/3">
                    <h2 class="text-xl font-semibold mb-4">Cart</h2>

                    <div v-if="cart.length === 0" class="text-gray-500">Your cart is empty.</div>
                    <div v-else>
                        <div v-for="item in cart" :key="item.id" class="flex items-center border p-4 mb-2">
                            <!-- Product Image -->
                            <img :src="item.img_url" alt="Product Image" class="w-16 h-16 object-cover rounded mr-4" />

                            <!-- Product Details -->
                            <div class="flex-1">
                                <span class="block font-semibold">{{ item.name }} (x{{ item.quantity }})</span>
                                <span class="text-gray-500">Price: {{ item.price }}</span>
                            </div>

                            <!-- Total Price -->
                            <span class="font-bold text-teal-500">{{ (item.price * item.quantity).toFixed(2) }}</span>

                            <!-- Remove Button -->
                            <button @click="removeFromCart(item.id)" class="ml-4 text-red-500">X</button>
                        </div>

                    </div>

                    <div class="flex justify-end mt-4">
                        <button @click="closeCartModal" class="bg-gray-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            </div>
            <!-- Product Modal -->
            <div v-if="isModalOpen" @click.self="closeModal"
                class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div class="bg-white p-6 rounded shadow-lg w-1/3">
                    <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h2>
                    <form @submit.prevent="handleProductSubmit">
                        <div class="mb-4">
                            <label for="name" class="block text-sm font-semibold">Product Name</label>
                            <input type="text" id="name" v-model="form.name" class="w-full p-2 border rounded"
                                placeholder="Product Name" required />
                        </div>

                        <div class="mb-4">
                            <label for="price" class="block text-sm font-semibold">Product Price</label>
                            <input type="number" id="price" v-model="form.price" class="w-full p-2 border rounded"
                                placeholder="Product Price" required />
                        </div>

                        <div class="mb-4">
                            <label for="img_url" class="block text-sm font-semibold">Image URL</label>
                            <input type="text" id="img_url" v-model="form.img_url" class="w-full p-2 border rounded"
                                placeholder="Image URL" />
                        </div>

                        <div class="mb-4">
                            <label for="category" class="block text-sm font-semibold">Category</label>
                            <select id="category" v-model="form.category_id" class="w-full p-2 border rounded" required>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="brand" class="block text-sm font-semibold">Brand</label>
                            <select id="brand" v-model="form.brand_id" class="w-full p-2 border rounded" required>
                                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                                    {{ brand.name }}
                                </option>
                            </select>
                        </div>

                        <div class="flex justify-end">
                            <button @click="closeModal" type="button"
                                class="mr-4 bg-gray-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                            <button type="submit" class="bg-teal-500 text-dark px-4 py-2 rounded">
                                {{ isEditing ? 'Save Changes' : 'Add Product' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Menu from '../Includes/Menu.vue';
import axios from 'axios';
export default {
    components: {
        Menu,
        axios
    },
    data() {
        return {
            products: [],
            categories: [],
            brands: [],
            cart: [],
            loading: true,
            isModalOpen: false,
            isEditing: false,
            isCartModalOpen: false,
            form: {
                id: null,
                name: '',
                price: '',
                img_url: '',
                category_id: null,
                brand_id: null,
            },
        };
    },
    mounted() {
        this.fetchProducts();
        this.fetchCategories();
        this.fetchBrands();
        this.loadCartFromLocalStorage();
    },
    methods: {
        async handleProductSubmit() {
            try {
                if (this.isEditing) {
                    // Edit Product
                    const response = await axios.put(
                        `http://127.0.0.1:8000/api/products/${this.form.id}`,
                        this.form
                    );
                    const updatedProduct = response.data;
                    // Update the product in the local list
                    const index = this.products.findIndex(p => p.id === updatedProduct.id);
                    if (index !== -1) {
                        this.$set(this.products, index, updatedProduct);
                    }
                    this.fetchProducts();


                } else {
                    // Add New Product
                    const response = await axios.post('http://127.0.0.1:8000/api/products', this.form);
                    const newProduct = response.data;
                    this.products.push(newProduct);
                }
                this.closeModal();


            } catch (error) {
                console.error('Error saving product:', error);
            }
        },
        async fetchProducts() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products');
                this.products = response.data;
                this.loading = false;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchBrands() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/brands');
                this.brands = response.data;
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        },
        async deleteProduct(productId) {
            if (!confirm('Are you sure you want to delete this product?')) {
                return;
            }
            try {
                await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`);
                this.products = this.products.filter(product => product.id !== productId);
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        },
        addToCart(product) {
            const cartItem = this.cart.find(item => item.id === product.id);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            //this.openCartModal();
            this.saveCartToLocalStorage();
            alert('Add to Cart Successfully');
            this.isCartModalOpen = true;
        },
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
        },
        saveCartToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        loadCartFromLocalStorage() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
            }
        },
        openProductModal(product = null) {
            this.isEditing = !!product;
            this.form = product
                ? { ...product }
                : { id: null, name: '', price: '', img_url: '', category_id: null, brand_id: null };
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        openCartModal() {
            this.isCartModalOpen = true;
        },
        closeCartModal() {
            this.isCartModalOpen = false;
        },

    }
}
</script>

<style lang="scss" scoped></style>