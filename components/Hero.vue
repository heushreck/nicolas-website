<template>
    <div class="hero-container">
        <hr class="hr">
        <div class="h2">{{ subtitle }}</div>
    </div>
    
</template>


<script setup>
    defineProps(
        {
            title: {
                type: String,
                required: true
            },
            subtitle: {
                type: String,
                required: true
            },
        }
    );
</script>

<style scoped>
    .hero-container {
        display: flex; 
        flex-direction: column; 
        align-items: center; 
    }
    .h2 {
        font-size: 1.125rem;
        line-height: 1.75rem;
        margin-bottom: 1rem;


        @media (min-width: 768px) { 
            font-size: 0.875rem;
            line-height: 1.25rem; 
        }
        @media (min-width: 1024px) { 
            font-size: 1.25rem;
            line-height: 1.75rem; 
        }
    }
    .hr {
        border-radius: 0.25rem; 
        border-width: 0; 
        width: 12rem; 
        height: 0.25rem; 
        background-color: #6B7280; 


        @media (min-width: 768px) { 
            margin-top: 2.5rem;
            margin-bottom: 2.5rem; 
        }
    }
</style>