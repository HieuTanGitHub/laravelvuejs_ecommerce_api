<template>
    <div>

        <nav class="bg-gray-50 dark:bg-gray-700">
            <div class="max-w-screen-xl px-4 py-3 mx-auto">
                <div class="flex items-center">
                    <ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                        <li>

                            <Link :href="route('dashboard')" class="text-gray-900 dark:text-white hover:underline"
                                aria-current="page">
                            Dashboard</Link>

                        </li>
                        <li>
                            <Link :href="route('categories.index')"
                                class="text-gray-900 dark:text-white hover:underline" aria-current="page">
                            Categories</Link>
                        </li>
                        <li>
                            <Link :href="route('brands.index')" class="text-gray-900 dark:text-white hover:underline"
                                aria-current="page">
                            Brands</Link>
                        </li>
                        <li>
                            <Link :href="route('products.index')" class="text-gray-900 dark:text-white hover:underline"
                                aria-current="page">
                            Products</Link>
                        </li>
                        <li>
                            <Link :href="route('checkout.index')" class="text-gray-900 dark:text-white hover:underline"
                                aria-current="page">
                            Checkout</Link>
                        </li>
                        <li>
                            <Link :href="route('order.index')" class="text-gray-900 dark:text-white hover:underline"
                                aria-current="page">
                            Orders</Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>

    </div>
</template>

<script>
import { Link } from '@inertiajs/vue3';

export default {
    components: {
        Link,
    },
}
</script>

<style lang="scss" scoped></style>