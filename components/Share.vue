<template>
    <div class="share-container">
        <button type="button" @click="handleShare('linkedIn')" class="button">
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"></path>
            </svg>
            
        </button>
        <button type="button" @click="handleShare('twitter')" class="button">
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
            </svg>
            
        </button>
        <button type="button" @click="sendEmail" class="button">
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path>
            </svg>
            
        </button>
    </div>
</template>

<script setup>
const props = defineProps(
    {
        title: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true
        },
        tags: {
            type: Array,
            required: true
        }
    }
);

const sendEmail = () => {
    const link = `mailto:?subject=${props.title}&body=${window.location.href}%0D%0A${props.shortDescription}`
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
        url = `https://twitter.com/intent/tweet?text=${props.title}&url=${window.location.href}&hashtags=${props.tags.join(',')}`
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

</script>

<style scoped>
.share-container {
    display: flex; 
    flex-direction: row; 
    align-items: center; 
    place-content: center; 
    max-width: 1024px; 
    gap: 1rem; 
    margin-bottom: 3rem;
}
.button {
    display: inline-flex; 
    padding-top: 0.625rem;
    padding-bottom: 0.625rem; 
    padding-left: 1.25rem;
    padding-right: 1.25rem; 
    align-items: center; 
    border-radius: 0.5rem; 
    font-size: 0.875rem;
    line-height: 1.25rem; 
    font-weight: 500; 
    text-align: center; 
    color: #ffffff;
    background-color: rgb(5 150 105);
}
.svg {
    width: 0.875rem; 
    height: 0.875rem; 
}
</style>