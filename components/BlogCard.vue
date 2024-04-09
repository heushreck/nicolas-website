<template>
    <div class="blogCard">
        <a :href="`/blog/${id}`">
            <img class="image" :src="image" alt="Blog title Image" title="Blog title Image" />
        </a>
        <div class="content">
            <a :href="`/blog/${id}`">
                <h5 class="title">{{title}}</h5>
            </a>
            <p class="date">{{ date }}</p>
            <p class="shortDescription">{{ shortDescription }}</p>
            <a :href="`/blog/${id}`" class="button">
                Read more
                <svg class="svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
    </div>
</template>

<script setup>
    defineProps(
        {
            id: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            shortDescription: {
                type: String,
                required: true
            },
            date: {
                type: String,
                required: true
            }
        }
    );    

</script>

<style scoped>
    a {
        text-decoration: none;
        color: #374151;
    }
    a:hover {
        text-decoration: none;
        color: #374151;
    }

    p {
        margin: 5px;
    }

    .blogCard  {
        background: #f4f2ef;
        max-width: 20rem;
        border-width: 1px;
        border-color: rgb(229 231 235);
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
    .image {
        border-top-left-radius: 0.5rem; /* 8px */
        border-top-right-radius: 0.5rem; /* 8px */  
    }
    .content {
        padding: 1rem; 
    }
    .title {
        font-size: 1.5rem;
        line-height: 2rem; 
        font-weight: 700; 
        letter-spacing: -0.025em; 
    }
    .date {
        font-size: 0.875rem;
        line-height: 1.25rem; 
        font-weight: 500; 
        color: #6B7280;
    }
    .shortDescription {
        margin-bottom: 0.75rem; 
        font-weight: 400; 
        color: #374151; 
    }
    .button {
        display: inline-flex; 
        padding-top: 0.5rem;
        padding-bottom: 0.5rem; 
        padding-left: 0.75rem;
        padding-right: 0.75rem; 
        align-items: center; 
        border-radius: 0.5rem; 
        font-size: 0.875rem;
        line-height: 1.25rem; 
        font-weight: 800; 
        text-align: center; 
        color: #ffffff;
        background-color: rgb(5 150 105);
    }
    .button:hover {
        color: #ffffff;
        background-color: rgb(4 120 87);
    }
    .svg {
        margin-left: 10px;
        width: 0.875rem; 
        height: 0.875rem; 
    }
</style>