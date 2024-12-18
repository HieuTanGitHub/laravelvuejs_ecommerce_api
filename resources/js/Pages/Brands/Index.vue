<template>
    <div>
        <Menu></Menu>
        <h1 style="text-align: center;font-size: 20px;">Manage Brands</h1>

        <div v-if="loading" class="text-center text-blue-600">Loading brands...</div>
        <div v-else>
            <button @click="openModal(null)" class="bg-teal-500 text-white px-4 py-2 rounded mb-4">
                Add Brand
            </button>

            <table class="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr class="bg-gray-100 text-left">
                        <th class="border border-gray-300 px-4 py-2">Id</th>
                        <th class="border border-gray-300 px-4 py-2">Name</th>
                        <th class="border border-gray-300 px-4 py-2">Description</th>
                        <th class="border border-gray-300 px-4 py-2">Manage</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="brand in brands" :key="brand.id">
                        <td class="border border-gray-300 px-4 py-2 text-center">{{ brand.id }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center">{{ brand.name }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center">{{ brand.description }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center"> <button @click="openModal(brand)"
                                class="text-teal-500 hover:text-teal-700">Edit</button>
                            |
                            <button @click="deleteBrand(brand.id)"
                                class="text-red-500 hover:text-red-700">Delete</button>
                        </td>
                    </tr>

                </tbody>
            </table>
            <!-- Modal for adding/editing categories -->
            <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div class="bg-white p-6 rounded shadow-lg w-1/3">
                    <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Brand' : 'Add Brand' }}</h2>

                    <form @submit.prevent="handleSubmit">
                        <div class="mb-4">
                            <label for="name" class="block text-sm font-semibold">Name</label>
                            <input type="text" id="name" v-model="form.name"
                                class="w-full p-2 border border-gray-300 rounded" placeholder="Brand Name" required />
                        </div>

                        <div class="mb-4">
                            <label for="description" class="block text-sm font-semibold">Description</label>
                            <input type="text" id="description" v-model="form.description"
                                class="w-full p-2 border border-gray-300 rounded" placeholder="Brand Description" />
                        </div>

                        <div class="flex justify-end">
                            <button type="button" @click="closeModal" class="mr-4 text-gray-500">Cancel</button>
                            <button type="submit" class="bg-teal-500 text-dark px-4 py-2 rounded">
                                {{ isEditing ? 'Save Changes' : 'Add Brand' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Menu from '../Includes/Menu.vue';

export default {
    components: {
        Menu,
        axios
    },
    data() {
        return {
            brands: [],
            loading: true,
            error: null,
            isModalOpen: false, // Modal visibility state
            isEditing: false, // Whether we're editing an existing 
            form: {
                id: null,
                name: '',
                description: '',
            },
        }

    },
    mounted() {
        this.fetchBrands(); // Fetch categories when component is mounted
    },
    methods: {
        async fetchBrands() {
            try {
                // Make the GET request to the API endpoint
                const response = await axios.get("http://127.0.0.1:8000/api/brands");
                this.brands = response.data; // Assign data to categories
                //console.log(this.brands);
            } catch (error) {
                console.error("Error fetching brands:", error);
                this.error = "Failed to load brands. Please try again later.";
            } finally {
                this.loading = false; // Stop loading spinner
            }
        },
        async handleSubmit() {
            if (this.isEditing) { //Edit
                await this.updateBrand();
            } else { //Add
                await this.addBrand();
            }
            this.closeModal();
        },
        async addBrand() {
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/brands", this.form);
                this.brands.push(response.data); // Add new brand to local list
            } catch (error) {
                console.error("Error adding brand:", error);
            }
        },
        async updateBrand() {
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/brands/${this.form.id}`, this.form);
                const index = this.brands.findIndex(brand => brand.id === this.form.id);
                if (index !== -1) {
                    this.brands[index] = response.data; // Update the brand in the local list
                }
            } catch (error) {
                console.error("Error updating brand:", error);
            }
        },
        openModal(brand) {
            if (brand) {
                this.isEditing = true;
                this.form = { ...brand }; // Pre-fill form for editing
            } else {
                this.isEditing = false;
                this.form = { id: null, name: '', description: '' }; // Reset form for adding
            }
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        async deleteBrand(id) {
            try {
                if (confirm('Are you sure you want to delete this brand?')) {
                    // Make the DELETE request to the API
                    await axios.delete(`http://127.0.0.1:8000/api/brands/${id}`);
                    this.brands = this.brands.filter(brand => brand.id !== id); // Remove from local state
                    alert('Brand deleted successfully.');
                }
            } catch (error) {
                console.error('Error deleting brand:', error);
                alert('Failed to delete brand.');
            }
        }
    }

}
</script>

<style lang="scss" scoped></style>