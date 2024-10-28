<script setup>
    definePageMeta({
        title: "Activity Management",
    });
    const { $swal, $router } = useNuxtApp();
    import { useUserStore } from "~/stores/user";
    
    const userStore = useUserStore();
    const id = userStore.userId;
    // alert(JSON.stringify(userStore.username));
    const config = useRuntimeConfig();
    const apiURL = config.public.uploadURL;
    // console.log("apiURL: ", apiURL);

    const modalEdit = ref(false);
    const modalAdd = ref(false);
    const modalDelete = ref(false);
    const selectedActivity = ref(null);
    const activities = ref(null);
    const field =['title' ,'status', 'createdAt','action'];
    
    const editInput = ref('');
    const imageInput = ref('');
    const descriptionInput = ref('');
    const urlInput=ref('');
    const statusInput = ref('');
    const titleInput = ref('');
    const imageFile=ref('');
    const imageFileName=ref('');
    const imageInputEdit= ref('');
    const imageFile2=ref('');
    const imageFileName2=ref('');

    const titleError = ref('');
    const imageError = ref('');
    const descriptionError = ref('');
    const urlError = ref('');
    const statusError = ref('');

    const onChangeFile = async (event) => {      
      const file = event.target.files[0];  // Get the first file from the input
      const fileType = file.type;
      try {
        const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
          const base64Data = await ToBase64OpsImage(compressedImage);

          imageFile.value = base64Data;  // Store the file in your form data
          imageFileName.value = file.name;
      }
      catch (error) {
        $swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "An error occurred while processing the file.",
        });
      } 
    };

    const onChangeFile2 = async (event) => {      
      const file2 = event.target.files[0];  // Get the first file from the input
      const fileType2 = file2.type;
      try {
        const compressedImage2 = await resizeAndCompressImage(file2, 800, 600, 0.7);
        const base64Data2 = await ToBase64OpsImage(compressedImage2);

        imageFile2.value = base64Data2;  // Store the file in your form data
        imageFileName2.value = file2.name;
       
      } catch (error) {
        $swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "An error occurred while processing the file.",
        });
      } 
    };

    async function ToBase64OpsImage(file) 
    {
      return new Promise((resolve, reject) => 
      {
        const reader = new FileReader();
        reader.onload = event => 
        {
          const base64Data = event.target.result;
          resolve(base64Data);
        };
        reader.onerror = error => 
        {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    }

    function resizeAndCompressImage(file, maxWidth, maxHeight, quality) 
    {
      return new Promise((resolve, reject) => 
      {
        const reader = new FileReader();
        reader.onload = function(event)
        {
          const img = new Image();
          img.src = event.target.result;

          img.onload = function() {
            let width = img.width;
            let height = img.height;

            if (width > height) 
            {
              if (width > maxWidth) 
              {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } 
            else 
            {
              if (height > maxHeight) 
              {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              file.type,
              quality
            );
          };
        };

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
      });
    }

    // list
    const activity = await useFetch("/api/rehab-center/activity/list", {
        method: "GET",
        query: {
            id: userStore.username,
        },
    });
    // alert(JSON.stringify(activity.data.value));
    // const activity = await useFetch('/api/rehab-center/activity/list');
    if(activity.data.value.response == 200)
    {
      // activity.data.value.data.activities
        activities.value = activity.data.value.data.activities;
    }
    else
    {
        alert("An error occurred while fetching activities. Please try again.");
    }
    //add

    const openAdd = () =>{
      modalAdd.value=true;
      titleInput.value = null;
      imageInput.value = null;               
      descriptionInput.value = null;
      urlInput.value= null;
      statusInput.value = nulls;

    };

    const closeAdd= () =>{
      modalAdd.value = false;
    };

    const validateFields = () => {
        let isValid = true;

        // Reset errors
        titleError.value = '';
        imageError.value = '';
        descriptionError.value = '';
        urlError.value = '';
        statusError.value = '';

        // Check each required field
        if (!titleInput.value) {
            titleError.value = 'Title is required';
            isValid = false;
        }
        // if (!imageInput.value) {
        //     imageError.value = 'Image is required';
        //     isValid = false;
        // }
        if (!descriptionInput.value) {
            descriptionError.value = 'Description is required';
            isValid = false;
        }
        if (!urlInput.value) {
            urlError.value = 'URL is required';
            isValid = false;
        }
        if (!statusInput.value) {
            statusError.value = 'Status is required';
            isValid = false;
        }

        return isValid;
        };

    // clickAdd
    const clickAdd = async () => {
        if (!validateFields()) {
            return; // Stop if form is invalid
        }

        const formData = new FormData();
        formData.append("title", titleInput.value);
        formData.append("image", imageInput.value);
        formData.append("description", descriptionInput.value);
        formData.append("url", urlInput.value);
        formData.append("status", statusInput.value);
        formData.append("user_id", id);

        try {
          // upload image licenses
          const { data:uploadImage } = await useFetch("/api/rehab-center/activity/upload", {
            method: 'POST',
            body: {
              base64Data: imageFile.value,
              fileName: imageFileName.value,              
            },
          });

          if(uploadImage.value.respond == 200) 
          {
            imageInput.value = uploadImage.value.data.filePath;
            const { data: add } = await useFetch("/api/rehab-center/activity/create", {
                method: "POST",
                body: JSON.stringify({  
                    user_id : id,
                    titleInput:titleInput.value,
                    imageInput:imageInput.value,
                    descriptionInput:descriptionInput.value,
                    urlInput:urlInput.value,
                    statusInput:statusInput.value
                }),
            });        

            if (add.value.response === 200) 
            {
                modalAdd.value = false;
                $swal.fire({
                    position: "center",
                    title: "Success",
                    text: add.value.message,
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                });

                setTimeout(() => {
                    $router.go();
                }, 1000);
            } 
            else 
            {
                alert("Activity failed to create.");
            }
          }
          else
          {
            return {
              respond: 500,
              message: "Error saving the file",
              error: error.message,
            };
          }      
        } 
        catch (error) 
        {
            console.error("Failed to created activity", error);
            alert("An error occurred while created activity details. Please try again.");
        }
    };

    // edit
    const editButton = async  (id) =>
    {       
      selectedActivity.value=id;
        try {
            const { data: detail } = await useFetch("/api/rehab-center/activity/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });
            // alert(JSON.stringify(detail.value.data.activity_image));
            if (detail.value.response === 200) 
            {
              editInput.value=detail.value.data.activity_id;
              titleInput.value = detail.value.data.activity_title;
              imageInputEdit.value = detail.value.data.activity_image;               
              descriptionInput.value = detail.value.data.activity_content;
              urlInput.value= detail.value.data.activity_media_url;
              statusInput.value = detail.value.data.activity_status;
              // alert(imageInput.value);
              modalEdit.value = true;

              // alert(imageInputEdit.value);
            } 
            else 
            {
                alert("Activity not found.");
            }
        } 
        catch (error) 
        {
            console.error("Failed to fetch activity details: 1", error);
            alert("An error occurred while fetching activity details. Please try again.");
        }
    };

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => 
    {
      if(imageFile2.value)
      {
        const { data:uploadImage } = await useFetch("/api/rehab-center/activity/upload", {
          method: 'POST',
          body: {
            base64Data: imageFile2.value,
            fileName: imageFileName2.value,              
          },
        });

        if(uploadImage.value.respond == 200) 
        {
          imageInputEdit.value = uploadImage.value.data.filePath;
        }
      }      
      // alert(imageInputEdit.value);
      try {
        const { data: update } = await useFetch("/api/rehab-center/activity/update", {
            method: "POST",
            body: JSON.stringify({  
                activityID : selectedActivity.value,
                titleInput:titleInput.value,
                imageInput:imageInputEdit.value,
                descriptionInput:descriptionInput.value,
                urlInput:urlInput.value,
                statusInput:statusInput.value
            }),
        });  
        // alert(JSON.stringify(update.value));
        if (update.value.response === 200) 
        {
          modalEdit.value = false;
          $swal.fire({
            position: "center",
            title: "Success",
            text: update.value.message,
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });

          setTimeout(() => {
            $router.go();
          }, 1000);
        } 
        else 
        {
            alert("Activity failed to update.");
        }
        
      } 
      catch (error) {
        console.error("Failed to updated activity details:", error);
        alert("An error occurred while updated activity details. Please try again.");
      }
    };

    //delete
    const closeDelete= () =>{
      modalDelete.value = false;
    };
    
    const confirmDelete = (id) => {
        selectedActivity.value = id;
        modalDelete.value = true;
    };
    
    const clickDelete = async () => 
    {
      try {
        const { data:deleted} = await useFetch("/api/rehab-center/activity/delete", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedActivity.value,
            }),
        });        

        if (deleted.value.response === 200) 
        {
          modalDelete.value = false;
          $swal.fire({
            position: "center",
            title: "Success",
            text: deleted.value.message,
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });

          setTimeout(() => {
            $router.go();
          }, 1000);
        } 
        else 
        {
            alert("Activity failed to update.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to updated activity details:", error);
          alert("An error occurred while updated activity details. Please try again.");
      }
        activities.value = activities.value.filter(activity => activity.id !== selectedActivity.value.id);
        modalDelete.value = false;
        selectedActivity.value = null;
    };

    const statusOptions = ref([]);
    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    statusOptions.value = lookupData.data.filter(item => item.lookupType == 'activity_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    statusOptions.value.unshift({ value: "", label: "Please choose" });
    
    // Function to format date to dd-mm-yyyy hh:mm:ss
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      
      // Extract day, month, year, hours, minutes, and seconds
      const day = String(date.getDate()).padStart(2, "0");      // Ensure 2 digits for day
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month (months are 0-indexed)
      const year = date.getFullYear();                           // Full year
      
      const hours = String(date.getHours()).padStart(2, "0");    // Ensure 2 digits for hours
      const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure 2 digits for minutes
      const seconds = String(date.getSeconds()).padStart(2, "0"); // Ensure 2 digits for seconds

      // Return the formatted string
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };
</script>

<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Activity Management
      </div>
      <br>
     
      <!-- Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-6">
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-blue-100 rounded-2xl"
            >
              <Icon
                class="text-blue-500"
                name="material-symbols:shield-with-house-rounded"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ activity.data.value.data.user.userFullName }}</span>
              <span class="text-base font-semibold text-gray-500">
                Rehab-center Name
              </span>
            </div>
          </div>
        </rs-card>

        <!-- Summary Card #1 -->
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="material-symbols:add-photo-alternate-sharp"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ activities.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Activities
              </span>
            </div>
          </div>
        </rs-card>
      </div>
      <!-- List of activities -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Activities </div>
          <div class="flex justify-end items-center mb-3 gap-5">
            
            <rs-button variant="primary" @click="openAdd">            
              <Icon name="solar:add-square-broken" class="mr-2" /> Add Activity
            </rs-button>
            <rs-modal title="Add Activity" v-model="modalAdd" size="lg" position="center" :overlayClose="false">
                <template v-slot:header>
                    Add Activity
                </template>
                <template v-slot:body>
                    <form>
                    <!-- Title Input -->
                    <FormKit type="text" label="Title *" v-model="titleInput" placeholder="Title" required />
                    <p v-if="titleError" class="text-red-500 text-sm">{{ titleError }}</p>

                    <!-- Image Upload -->
                    <FormKit type="file" label="Image *" v-model="imageInput" accept="image/*" @change="onChangeFile" required />
                    <p v-if="imageError" class="text-red-500 text-sm">{{ imageError }}</p>

                    <!-- Description Input -->
                    <FormKit type="textarea" v-model="descriptionInput" placeholder="Activity Description" rows="5" label="Description *" required />
                    <p v-if="descriptionError" class="text-red-500 text-sm">{{ descriptionError }}</p>

                    <!-- URL Input --> 
                    <FormKit type="text" label="URL *" v-model="urlInput" placeholder="https://example.com" required />
                    <p v-if="urlError" class="text-red-500 text-sm">{{ urlError }}</p>

                    <!-- Status Dropdown -->
                    <FormKit type="select" label="Status *" v-model="statusInput" :options="statusOptions" required />
                    <p v-if="statusError" class="text-red-500 text-sm">{{ statusError }}</p>
                    </form>
                </template>
                <template v-slot:footer>
                    <rs-button @click="closeAdd">Cancel</rs-button>
                    <rs-button @click="clickAdd">Add</rs-button>
                </template>
            </rs-modal>
          </div>
  
          <rs-table v-if="activities.length > 0"
            :data="activities"
            :options="{
              variant: 'default',
              striped: true,
              borderless: true,
            }"
            :field = "field"
            :options-advanced="{
              sortable: true,
              
              filterable: false,
            }"
            advanced
          >
          <template #title ="activities" >
                {{ activities.value.activity_title}}
          </template>
          <template #status ="activities" >
                {{ activities.value.activity_status}}
          </template>
          <template #createdAt ="activities" >
                {{ formatDate(activities.value.created_at)}}
          </template>
            <template #action="activities">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(activities.value.activity_id)">
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Edit
                </rs-button>
                <rs-modal title="Edit Activity" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Activity
                  </template>
                  <template v-slot:body>
                    <form >
                      <FormKit type="text" label="Title *" v-model="titleInput" placeholder="Title" required /> 
                    <p v-if="titleError" class="text-red-500 text-sm">{{ titleError }}</p>

                    <!-- Image Upload -->
                    <div >
                      <img :src="apiURL+ imageInputEdit" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
                    </div>
                    <FormKit type="file" label="Image *" v-model="imageInput" accept="image/*" @change="onChangeFile2" required />
                    <p v-if="imageError" class="text-red-500 text-sm">{{ imageError }}</p>

                    <!-- Description Input -->
                    <FormKit type="textarea" v-model="descriptionInput" placeholder="Activity Description" rows="5" label="Description *" required />
                    <p v-if="descriptionError" class="text-red-500 text-sm">{{ descriptionError }}</p>

                    <!-- URL Input --> 
                    <FormKit type="text" label="URL *" v-model="urlInput" placeholder="https://example.com" required />
                    <p v-if="urlError" class="text-red-500 text-sm">{{ urlError }}</p>

                    <!-- Status Dropdown -->
                    <FormKit type="select" label="Status *" v-model="statusInput" :options="statusOptions" required />
                    <p v-if="statusError" class="text-red-500 text-sm">{{ statusError }}</p>
                    </form>
                    
                  </template>
                  <template v-slot:footer >
                    <rs-button @click="closeEdit">Cancel</rs-button>
                    <rs-button @click="clickUpdate">Update</rs-button>
                  </template>
                </rs-modal>
                <rs-button variant="danger" @click="confirmDelete(activities.value.activity_id)">
                  <Icon
                    name="material-symbols:delete-sharp"
                    class="mr-2 !w-4 !h-4"
                  />
                  Delete
                </rs-button>
              </div>
            </template>
          </rs-table>
          <div v-else> No data</div>
        </div>
      </div>
  
      <!-- Confirmation Modal -->
      <rs-modal title="Confirm Deletion" v-model="modalDelete" size="md" position="center" >
        <template v-slot:header>
          Confirm Deletion
        </template>
        <template v-slot:body>
          Are you sure you want to delete this activity?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeDelete">Cancel</rs-button>
          <rs-button @click="clickDelete">Delete</rs-button>
        </template>
      </rs-modal>
  
    </div>
</template>
  

  
<style lang="scss" scoped>
.text-red-500 {
  color: #f56565;
}
.text-sm {
  font-size: 0.875rem;
}
</style>

  