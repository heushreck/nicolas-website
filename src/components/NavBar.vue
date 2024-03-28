<template>
    <nav class="border-gray-200">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Code .</span>
            </RouterLink>
            <div class="w-full md:block md:w-auto" id="navbar-default">
                <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
                    <li>
                        <RouterLink to="/" class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-emerald-800 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/blog" class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-emerald-800 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Blog</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/about" class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-emerald-800 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>