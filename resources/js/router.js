import { createRouter, createWebHistory } from "vue-router";
import Categories from "./components/Categories/Index.vue";
import Brands from "./components/Brands/Index.vue";
import Products from "./components/Products/Index.vue";

const routes = [
    {
        path: "/categories",
        component: Categories,
    },
    {
        path: "/brands",
        component: Brands,
    },
    {
        path: "/products",
        component: Products,
    },
    // Thêm các route khác nếu cần
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
