<template>
    <div class="custom-hero">
        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{{ blogEntry.title }}</h1>
        <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
        <h1 class="mb-4 text-lg text-gray-900 dark:text-white md:text-sm lg:text-xl">{{ blogEntry.date }}</h1>
        <div class="max-w-screen-lg flex flex flex-row items-center mx-auto place-content-center">
            <button type="button" @click="handleShare('linkedIn')" class="text-white bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"></path>
                </svg>
                
            </button>
            <button type="button" @click="handleShare('twitter')" class="text-white bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                </svg>
                
            </button>
            <button type="button" @click="sendEmail" class="text-white bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path>
                </svg>
                
            </button>
        </div>
        
    </div>
    <div class="max-w-screen-lg flex flex-col justify-between mx-auto p-4">
        <div v-html="markdownToHtml" class="markdown"></div>
        <div class="mt-4">
            <RouterLink v-for="tag in blogEntry.tags" :to="`/search/${tag}`" :key="tag" :class="`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${randomColor()}`">{{ tag }}</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import blogEntries from '../data/blog_entries/blogentries.json';
import { marked } from 'marked';
import { RouterLink } from 'vue-router';
const blogentries = blogEntries;
const route = useRoute()
const blogEntryId = route.params.blogEntryId;
const blogEntry = blogentries.find(blogentry => blogentry.id === blogEntryId);
document.title = blogEntry.title;

const markdownToHtml = computed(() => {
    return blogEntry.text;
});

const sendEmail = () => {
    const link = `mailto:?subject=${blogEntry.title}&body=${window.location.href}%0D%0A${blogEntry.shortDescription}`
    // open the mail client with the link
    window.open(link, '_blank');
}

const handleShare = (network) => {
    var popup = {
        width: 626,
        height: 436
    }
    var popupTop = 0
    var popupLeft = 0
    var popupWindow = undefined
    var popupInterval = null
    const width = window.innerWidth || (document.documentElement.clientWidth || window.screenX)
    const height = window.innerHeight || (document.documentElement.clientHeight || window.screenY)
    const systemZoom = width / window.screen.availWidth

    popupLeft = (width - popup.width) / 2 / systemZoom + (window.screenLeft !== undefined ? window.screenLeft : window.screenX)
    popupTop = (height - popup.height) / 2 / systemZoom + (window.screenTop !== undefined ? window.screenTop : window.screenY)
    if (popupWindow && popupInterval) {
        clearInterval(popupInterval)
        // Force close (for Facebook)
        popupWindow.close()
    }

    var url = ''
    if (network === 'linkedIn') {
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
    } else if (network === 'twitter') {
        url = `https://twitter.com/intent/tweet?text=${blogEntry.title}&url=${window.location.href}&hashtags=${blogEntry.tags.join(',')}`
    }

    popupWindow = window.open(
        url,
        'sharer-' + network.toLowerCase(),
        ',height=' + popup.height +
        ',width=' + popup.width +
        ',left=' + popupLeft +
        ',top=' + popupTop +
        ',screenX=' + popupLeft +
        ',screenY=' + popupTop
    )
    if (!popupWindow) return
    popupWindow.focus()
    popupInterval = setInterval(() => {
        if (!popupWindow || popupWindow.closed) {
            clearInterval(popupInterval)
            popupWindow = null
        }
        }, 500)
}

const randomColor = () => {
    const colors = [
        //'bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400',
        //'bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500',
        //'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400',
        //'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400',
        //'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300',
        //'bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400',
        //'bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 border border-purple-400',
        //'bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400'
        'bg-emerald-100 text-emerald-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-emerald-400 border border-emerald-400'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

</script>
