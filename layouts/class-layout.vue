<script lang="ts" setup>

</script>

<template>
    <NuxtLayout name="user-layout">
        <div class="flex w-full justify-between px-5 pb-5 bg-white border-b-2 border-gray-100">
            <div class="w-full flex justify-start gap-5">
                <NuxtLink to="/users/class/">Stream</NuxtLink>
                <NuxtLink to="/users/class/material">Material</NuxtLink>
                <NuxtLink to="/users/class/te">Exams</NuxtLink>
            </div>
            <div class="w-full flex justify-end max-md:hidden gap-3">
                <svg enable-background="new 0 0 24 24" focusable="false" height="20" viewBox="0 0 24 24" width="20" class=" NMm5M"><rect fill="none" height="24" width="24"></rect><path d="M7,4L2,9v9c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4.5l4,4v-11l-4,4V6c0-1.1-0.9-2-2-2H7z M16,18H4v-8l4-4h8V18z"></path></svg>
                <svg focusable="false" width="20" height="20" viewBox="0 0 24 24" class=" NMm5M"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path></svg>
                <svg enable-background="new 0 0 24 24" focusable="false" height="20" viewBox="0 0 24 24" width="20" class=" NMm5M"><rect fill="none" height="24" width="24"></rect><path d="M14.35,2.5h-4.7c-0.71,0-1.37,0.38-1.73,0.99L1.58,14.4c-0.36,0.62-0.36,1.38-0.01,2l2.35,4.09c0.36,0.62,1.02,1,1.73,1 h12.68c0.72,0,1.38-0.38,1.73-1l2.35-4.09c0.36-0.62,0.35-1.38-0.01-2L16.08,3.49C15.72,2.88,15.06,2.5,14.35,2.5z M18.34,19.5H5.66 l-2.35-4.09L9.65,4.5h4.7l6.34,10.91L18.34,19.5z M12.9,7.75h-1.8l-4.58,7.98L7.25,17h9.5l0.73-1.27L12.9,7.75z M9.25,15L12,10.2 l2.75,4.8H9.25z"></path></svg>
            </div>
        </div>
        <div>
            <slot/>
        </div>
    </NuxtLayout>
</template>
