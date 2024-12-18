<template>
    <div>
        <Menu></Menu>
        <h1>Manage Categories</h1>
        <div v-if="loading" class="text-center text-blue-600">Loading categories...</div>
        <div v-else>
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

                    <tr v-for="category in categories" :key="category.id">
                        <td class="border border-gray-300 px-4 py-2 text-center">{{ category.id }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center">{{ category.name }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center">{{ category.description }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center"> <button @click="openModal(category)"
                                class="text-teal-500 hover:text-teal-700">Edit</button>
                            |
                            <button @click="deleteCategory(category.id)"
                                class="text-red-500 hover:text-red-700">Delete</button>
                        </td>
                    </tr>

                </tbody>
            </table>
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
            categories: [],
            loading: true,
            error: null,    // Error state
        }

    },
    mounted() {
        this.fetchCategories(); // Fetch categories when component is mounted
    },
    methods: {
        async fetchCategories() {
            try {
                // Make the GET request to the API endpoint
                const response = await axios.get("http://127.0.0.1:8000/api/categories");
                this.categories = response.data; // Assign data to categories
                console.log(this.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                this.error = "Failed to load categories. Please try again later.";
            } finally {
                this.loading = false; // Stop loading spinner
            }
        },
    }

}
</script>

<style lang="scss" scoped></style>