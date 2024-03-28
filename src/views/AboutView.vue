<template>
    <div class="custom-hero">
        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">About Me</h1>
        <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
        <h1 class="mb-4 text-md text-gray-700 dark:text-white md:text-sm lg:text-lg">My name is Nicolas, I am a Data and AI Enthusiast from Munich, Germany.</h1>
    </div>
    <div class="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4 column">
      <ol class="relative border-s border-emerald-600 dark:border-gray-700">                  
          <li class="mb-10 ms-4">
              <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
              <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Since Sepember 2023</time>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AI Engineer at BCG X</h3>
              <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Blabla.</p>
              <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Learn more 
                <svg class="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </a>
          </li>
          <li class="mb-10 ms-4">
              <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
              <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">October 2022 - April 2023</time>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Analyst at Amazon Pay</h3>
              <p class="text-base font-normal text-gray-500 dark:text-gray-400">Blabla.</p>
          </li>
          <li class="mb-10 ms-4">
              <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
              <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2020 - April 2021</time>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Engineer at E.ON</h3>
              <p class="text-base font-normal text-gray-500 dark:text-gray-400">blabla.</p>
          </li>
          <li class="ms-4">
              <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
              <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2020 - April 2021</time>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Science at Burda</h3>
              <p class="text-base font-normal text-gray-500 dark:text-gray-400">blabla.</p>
          </li>
      </ol>
      <div class="w-full mb-8 md:w-1/2 lg:w-1/3 lg:mb-0">
        <img class="rounded-full" src="https://media.licdn.com/dms/image/D5603AQG2VQT_-XU17A/profile-displayphoto-shrink_800_800/0/1633939892232?e=1717027200&v=beta&t=fn6hX3gVla0yK2mAmG4o3QxetIatC3r2yWRp6qccR6Q" alt="image description">
      </div>
    </div>
</template>

<script setup>
import CodeCard from '../components/CodeCard.vue';
const title = '';
const code = `'use client';

import Link from 'next/link';
import { Navbar } from 'flowbite-react'xw;

function Component() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href=&#x22;https://flowbite-react.com&#x22;>
        <img src=&#x22;/favicon.svg&#x22; className=&#x22;mr-3 h-6 sm:h-9&#x22; alt=&#x22;Flowbite React Logo&#x22; />
        <span className=&#x22;self-center whitespace-nowrap text-xl font-semibold dark:text-white&#x22;>Flowbite React</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href=&#x22;#&#x22; active>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href=&#x22;#&#x22;>
          About
        </Navbar.Link>
        <Navbar.Link href=&#x22;#&#x22;>Services</Navbar.Link>
        <Navbar.Link href=&#x22;#&#x22;>Pricing</Navbar.Link>
        <Navbar.Link href=&#x22;#&#x22;>Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
`
</script>