<script lang="ts" setup>
</script>

<template>
    <NuxtLayout name="user-layout">
        <div class="pb-16">
            <div class="relative w-3/4 h-60 bg-[url('assets/card-3.jpg')] bg-cover bg-center p-5 rounded-md mt-10 flex mx-auto justify-center max-md:w-11/12 max-lg:w-11/12">
            <div class="absolute bottom-0 left-0 p-4 pb-10">
                <h3 class="text-2xl max-md:text-lg font-bold text-white">
                    TODO
                </h3>
            </div>
        </div>
        <div class="gap-5">
            <NuxtLink to="/users/class/exam1" >
            <div class="mx-auto w-3/4 max-md:w-11/12 max-lg:w-11/12 mt-5">
                <div class="border-2 border-gray-200 px-5 py-3 rounded-lg flex justify-between w-full">
                    <div class="flex">
                        <div class="bg-gray-100 h-14 w-14 rounded-full p-2">
                            <svg  style="color: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="96" y1="152" x2="160" y2="152" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><line x1="96" y1="120" x2="160" y2="120" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><path d="M160,40h40a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><path d="M88,72V64a40,40,0,0,1,80,0v8Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/></svg>
                        </div>
                        <div class="ml-5">
                            <h3 class="text-lg font-semibold">Operating System Exam</h3>
                            <div class="flex justify-between w-full">
                                <p class="text-gray-500 max-md">2 hours</p>
                                <p>/</p>
                                 <p class="text-gray-500 max-md">Start Time: 10 AM</p>
                            </div>
                            
                            </div>
                    </div>
                    
                    <div class="mr-5 mt-3 max-md:mr-1">
                        <svg class="h-6 w-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                    </div>
                </div>
            </div>
        </NuxtLink>
            <NuxtLink to="/users/class/exam1" >
                <div class="mx-auto w-3/4 max-md:w-11/12 max-lg:w-11/12 mt-5">
                    <div class="border-2 border-gray-200 px-5 py-3 rounded-lg flex justify-between w-full">
                    <div class="flex">
                        <div class="bg-gray-100 h-14 w-14 rounded-full p-2">
                            <svg  style="color: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="96" y1="152" x2="160" y2="152" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><line x1="96" y1="120" x2="160" y2="120" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><path d="M160,40h40a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><path d="M88,72V64a40,40,0,0,1,80,0v8Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/></svg>
                        </div>
                        <div class="ml-5">
                            <h3 class="text-lg font-semibold">Data Structures & Algorithms Assignment</h3>
                            <div class="flex justify-between w-full">
                                 <p class="text-gray-500 max-md">Due Time: Today at 11:59 AM</p>
                            </div>
                            </div>
                    </div>
                    
                    <div class="mr-5 mt-3 max-md:mr-1">
                        <svg class="h-6 w-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                    </div>
                </div>
                </div>
                
            </NuxtLink>
        </div>
        </div>
        
        
    </NuxtLayout>
</template>
