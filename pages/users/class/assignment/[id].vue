<template>
    <NuxtLayout name="user-layout">
        <p v-if="loading">loading</p>
        <div v-else class="grid grid-cols-8">
            <div class="w-full h-72 p-5 col-span-6">
                <div class="flex w-full justify-between pr-5">
                    <div class="flex">
                        <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" class=" NMm5M">
                            <path
                                d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z">
                            </path>
                        </svg>
                        <div class="ml-5 w-full">
                            <h1 class="font-semibold text-3xl">{{assignment.title}}</h1>
                            <div class="flex gap-2 mt-3">
                                <h1 class="text-md">
                                    {{assignment.course.lecturer.firstname}} {{assignment.course.lecturer.lastname}}
                                </h1>
                                <h1 class="text-md"> {{assignment.postedOn}}</h1>
                            </div>
                        </div>

                    </div>
                    <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" class=" NMm5M">
                        <path
                            d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z">
                        </path>
                    </svg>
                </div>
                <div class="flex justify-between w-full mt-3 pl-10">
                    <h1 v-if="assignment.assignmentStatus == `pending`" class="text-md"></h1>
                    <h1 v-if="assignment.assignmentStatus == `marked`" class="text-md">41/50</h1>
                    <h1 class="text-md font-semibold"> Due {{assignment.dueDate}}</h1>
                </div>
                <hr class="mt-3 w-full bg-gray-200 px-10">

                <div class="my-6 bg-white border border-gray-400 grid grid-cols-3 w-[50%] h-24 rounded-md">
              <div class="col-span-1 h-24">
                <img src="/assets/banner.jpg" alt="Document Preview" class="w-full h-full">
              </div>
              <div class="m-2 col-span-2 ">
                <h1 class="text-gray-800 font-semibold text-lg hover:underline hover:text-blue-500 truncate ">{{assignment.attachments.name}}</h1>
                <h1 class="font-light text-md truncate">{{ assignment.attachments.type }}</h1>
              </div>
            </div>
                <hr class=" w-full bg-gray-200 px-10">

            </div>
            <div class="w-full h-72 p-5 col-span-2 ">
                <div class="h-72 w-full bg-white shadow-md shadow-gray-400 p-5 rounded-lg">
                    <div class="flex w-full justify-between">
                        <h1 class="text-xl">Your work</h1>
                        <h1 v-if="assignment.assignmentStatus == `marked`" class="font-semibold text-sm">Graded</h1>
                    </div>
                    <div class="my-3 h-12 w-full bg-gray-200 rounded-lg"></div>
                    <div class="cursor-pointer flex justify-center text-center text-blue-700 flex py-2 border-2 border-gray-200">
                        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" color="blue" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/> </svg> -->
                        <!-- <h1 class=" ml-2 text-sm font-bold">Add/ Create</h1> -->
                        <input
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          placeholder="Add/Create"
          class="w-full truncate"
          multiple
        />
                    </div>
                    
                    <div v-if="assignment.assignmentDue" class="cursor-pointer flex justify-center text-center text-gray-700 bg-gray-300 rounded-md flex py-2 mt-5">
                        <h1 class="text-sm font-semibold">Submit</h1>
                    </div>
                    <div @click="addOrUpdateLabel" v-if="!assignment.assignmentDue" class="cursor-pointer flex justify-center text-center text-white bg-blue-500 rounded-md flex py-2 mt-5">
                        <h1 class="text-sm font-semibold">Submit</h1>
                    </div>
                    <h1 v-if="assignment.assignmentDue" class=" text-center mt-5 italic text-xs font-semibold">Work cannot be turned in after due date</h1>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const loading = ref(true)
const assignmentID = route.params.id;
const assignment = ref([])
const assignmentResponse = ref([])
const token = localStorage.getItem("Token")
const getAssignment = async()  =>{
    loading.value = true
const { data } = await useFetch(`http://localhost:7210/assignments/get-assignment-by-/${assignmentID}`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
assignment.value = data.value
console.log("Ass:" , assignment.value)
loading.value = false
}
const handleFileUpload = (event) => {
    assignmentResponse.value = Array.from(event.target.files);
    console.log(`Uploaded ${assignmentResponse.value} .`);
  };
  
  // Add or Update Label with Email
  const addOrUpdateLabel = async () => {
    loading.value = true
    if (!assignmentResponse.value.length) {
      alert("Please upload assignment.");
      return;
    }
    console.log("Uploading assignment")
  };
onMounted(() => {
getAssignment()
})
</script>
