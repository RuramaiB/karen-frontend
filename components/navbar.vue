<template>
        <div class="m-5 rounded-lg flex justify-between p-4 bg-white fixed top-0 left-0 right-0 z-12 shadow-md">
          <NuxtLink to="/admin/" class="flex">
            <!-- <div class="w-20 h-10">
                <img class="w-full h-full" src="/assets/logo.jpeg" alt="">
            </div> -->
            <h1 class="ml-5 font-bold mt-2 uppercase">Proper Dashboard</h1>
          </NuxtLink>
            

            
        <div class="flex">
            <svg @click="toggleNotifications" xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="my-2 mr-5" viewBox="0 0 512 512"><path d="M427.68,351.43C402,320,383.87,304,383.87,217.35,383.87,138,343.35,109.73,310,96c-4.43-1.82-8.6-6-9.95-10.55C294.2,65.54,277.8,48,256,48S217.79,65.55,212,85.47c-1.35,4.6-5.52,8.71-9.95,10.53-33.39,13.75-73.87,41.92-73.87,121.35C128.13,304,110,320,84.32,351.43,73.68,364.45,83,384,101.61,384H410.49C429,384,438.26,364.39,427.68,351.43Z" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><path d="M320,384v16a64,64,0,0,1-128,0V384" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>
            <div class="h-10 w-10">
                <img class="w-full h-full"src="/assets/profile.png">
            </div>
            <h1 class="text-sm font-semibold text-gray-950 ml-2 mt-2 truncate">{{ username }}</h1>
        </div>
        </div>
        <div v-if="isNotificationsOpen" class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <!-- Notification panel -->
    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">       
          <div class="pointer-events-auto w-screen max-w-md">
            <div class="flex h-full flex-col bg-white shadow-xl relative">
              <!-- Notification content with scrolling -->
              <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between mb-5">
                  <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Notifications</h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button type="button" @click="toggleNotifications" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                      <span class="absolute -inset-0.5"></span>
                      <span class="sr-only">Close panel</span>
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Notifications List with scrolling -->
                <div v-for="(notification, index) in notifications" :key="index"
                    :class="['p-5 rounded-xl w-full h-auto mb-5', openedNotifications[index] ? 'bg-gray-100' : 'bg-blue-200']"
                    @click="openNotificationModal(index)">
                  <div class="w-full flex justify-between">
                    <h1 class="text-md text-gray-800 font-medium">{{ notification.title }}</h1>
                  </div>
                  <p class="truncate text-gray-500 text-nowrap text-justify">{{ notification.body }}</p>
                  <div class="w-full flex justify-between mt-3 font-extralight text-md">
                    <h1 class="text-gray-600">{{ notification.postedOn }}</h1>
                    <h1 class="text-gray-600">{{ notification.postedAt }}</h1>
                  </div>
                </div>

                <hr class="bg-gray-900 my-5 w-full">
              </div>

              <!-- Floating Action Button for Broadcasting Notification -->
              <button
                @click="toggleAddNotifications()"
                class="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div v-if="addNotificationsModal" class="z-10 backdrop-blur-lg h-full top-0 absolute inset-0 flex items-center justify-center">
                       <div class="p-5">
                         <!-- Modal Content -->
                         <div class="flex justify-between">
                           <h2  class="text-xl font-bold mb-4 text-gray-800">Broadcast new notifictaion</h2>
                           <button  class="bg-red-500 text-white text-xl font-xl px-3 py-1 mb-4 rounded-md" @click="toggleAddNotifications">X</button>
                         </div>
                         <!-- <p v-if="!loading">Aiwa ndaremerwa</p> -->
                         <p v-if="loading">Processing the request</p>
                         <form  v-else  class=" grid grid-cols-1 gap-2 bg-white shadow-md rounded px-8 py-6 mb-4">
                            <div class="  grid grid-cols-2 gap-2">
                              <div>
                                <div class="mb-4">
                                  <label class="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                  <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                      type="text" v-model="notify.title" >
                                    <p v-if="errors.title" class="text-sm text-red-600 text-left mb-2">*{{errors.title}}</p>
                                </div>
                                <div>
                                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Topic</label>
                                <select v-model="notify.topic" class="select select-borderedblock w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                    <option disabled selected>Broadcast to:</option>
                                    <option value="allUsers">All Users</option>
                                  </select>
                                  <p v-if="errors.topic" class="text-sm text-red-600 text-left mb-2">*{{errors.topic}}</p>
                            </div>
                              </div>
                                   
                           <div>
                                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Body</label>
                                <textarea v-model="notify.body" rows="5" class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"></textarea>
                                <p v-if="errors.body" class="text-sm text-red-600 text-left mb-2">*{{errors.body}}</p>
                            </div>
                            
                           <!-- Submit Button -->
                            <div class="flex w-full justify-between">
                                <div class="ml-2">
                                <button type="button" @click="handleNotificationsBroadcast" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                >Send</button>
                              </div>
                            </div>
                           
                            </div>
                          
                           
                           
                         </form>        
                       </div>
        </div>
        <div v-if="showModal" class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ selectedNotification.title }}</h2>
          <button @click="closeNotificationModal" class="text-gray-500 hover:text-gray-700">X</button>
        </div>
        <p class="mb-4 text-gray-700">{{ selectedNotification.body }}</p>
        <div class="w-full flex justify-between mt-3 font-extralight text-md">
          <h1 class="text-gray-600">{{ selectedNotification.postedOn }}</h1>
          <h1 class="text-gray-600">{{ selectedNotification.postedAt }}</h1>
        </div>
        <!-- Delete Button -->
        <div class="mt-6 flex justify-end">
          <button @click="toggleDeleteModal(selectedNotification.notificationID)" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div v-if="deleteModal" class="fixed z-30 inset-0 flex items-center backdrop-blur-lg justify-center bg-black bg-opacity-10">
                 <div class="bg-white p-6 rounded-lg">
                   <p class="mb-4">Are you sure you want to delete?</p>
                   <div class="flex justify-end">
                     <button class="mr-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded" @click="handleDeleteOption('yes')">Yes</button>
                     <button
                       class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded" @click="handleDeleteOption('no')">No</button>
                   </div>
                 </div>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const username = localStorage.getItem('name');
const notifications = ref([]);
const deleteModal = ref(false)
const notificationID = ref(null)
const openedNotifications = ref(notifications.value.map(() => false))  // Track if a notification is opened
const showModal = ref(false)  // Modal visibility state
const selectedNotification = ref(null)  // The currently selected notification
const selectedIndex = ref(null)
const notify = ref({
  title: '',
  body: '',
  topic: '',
});

const errors = ref({
  title: '',
  body: '',
  topic: '',
});
const loading = ref(false);
// Example notifications array


// Toggle notification panel
const isNotificationsOpen = ref(false);
const addNotificationsModal = ref(false);
const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};
const toggleAddNotifications = () => {
  addNotificationsModal.value = !addNotificationsModal.value;
};
const handleNotificationsBroadcast = async () => {
  // Clear previous errors
  errors.value = {};

  // Validate input fields
  if (!notify.value.title) {
    errors.value.title = "Notification title is required";
  } else if (!notify.value.body) {
    errors.value.body = "Notification body is required";
  } else if (!notify.value.topic) {
    errors.value.topic = "Broadcast level is required.";
  } else {
    try {
      // Set loading state
      loading.value = true;
      // Make the API call to update the vehicle
      const { data: responseData, error } = await useFetch(
        `https://morelife.hushsoft.co.zw/notifications/broadcast`,
        {
          method: 'post',
          
          body: {
            title: notify.value.title,
            body: notify.value.body,
            topic: notify.value.topic,
          },
        }
      );

      if (error.value) {
        // Handle API error
        alert("Error adding department: " + error.value.message);
      } else {
        // Show success message
        alert(responseData.value);

        // Reset the update status
        addNotificationsModal.value = false;

        // Reload the Nuxt app to refresh the data
        reloadNuxtApp();
      }
    } catch (err) {
      // Handle unexpected errors
      alert("An unexpected error occurred: " + err.message);
    } finally {
      // Reset loading state
      loading.value = false;
    }
  }
};
const fetchNotifications = async () => {
  try {
    const email = localStorage.getItem("Email"); // Get the FCM token from localStorage

    if (!email) {
      throw new Error('No Email found');
    }

    // Use the `useFetch` composable for making the request
    const { data, error } = await useFetch(`https://morelife.hushsoft.co.zw/notifications/get-all-notifications-by-broadcast-and-by-user-/${email}`);
    console.log(data.value)
    if (error.value) {
      console.error('Error fetching notifications:', error.value);
      return;
    }

    notifications.value = data.value;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};
const openNotificationModal = (index) => {
  selectedNotification.value = notifications.value[index]
  selectedIndex.value = index
  showModal.value = true
  openedNotifications.value[index] = true
}

// Function to close the notification modal
const closeNotificationModal = () => {
  showModal.value = false
  selectedNotification.value = null
}
const toggleDeleteModal = (notNum) => {
    deleteModal.value = !deleteModal.value
    notificationID.value = notNum
}
const handleDeleteOption = async (option) =>{
    if(option == "no"){
      deleteModal.value = false
    }else{
      loading.value = true
       const { data: responseData } = await useFetch(`https://morelife.hushsoft.co.zw/notifications/delete-notification-by-/${notificationID.value}`, {
         method: 'delete',
     },)
     alert("Notification deleted successfully")
     loading.value = false
     deleteModal.value = false
     reloadNuxtApp()
    }
 }
// Example: Fetch previous notifications when the component is mounted
onMounted(() => {
  fetchNotifications()
});
</script>

<style>

</style>