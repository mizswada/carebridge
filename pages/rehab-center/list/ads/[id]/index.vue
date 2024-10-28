<script setup>
    definePageMeta({
        title: "Advertising Management",
    });
    const { $swal, $router } = useNuxtApp();
    const id = useRoute().params.id;

    const config = useRuntimeConfig();
    const apiURL = config.public.uploadURL;
    // console.log("apiURL: ", apiURL);

    const modalEdit = ref(false);
    const modalAdd = ref(false);
    const modalDelete = ref(false);
    const selectedAdvertising = ref(null);
    const advertisings = ref(null);
    const field =['image' ,'url','status', 'action'];
    
    const editInput = ref('');

   
    const imageInput=ref('');
    const urlInput = ref('');
    const statusInput= ref('');    
    
    const imageFile=ref('');
    const imageFileName=ref('');
    const imageInputEdit= ref('');
    const imageFile2=ref('');
    const imageFileName2=ref('');

    const imageError = ref('');
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
    const advertising = await useFetch("/api/rehab-center/ads/list", {
        method: "GET",
        query: {
            id: parseInt(id),
        },
    });
    // alert(JSON.stringify(advertising.data.value));
    // const advertising = await useFetch('/api/rehab-center/ads/list');
    if(advertising.data.value.response == 200)
    {
        advertisings.value = advertising.data.value.data.advertisings;
    }
    else
    {
        alert("An error occurred while fetching advertisings. Please try again.");
    }
    //add

    const openAdd = () =>{
        modalAdd.value=true;
        imageInput.value = null;               
        urlInput.value = null;
        statusInput.value=null;
    };

    const closeAdd= () =>{
      modalAdd.value = false;
    };

    const validateFields = () => 
    {
        let isValid = true;
       
        imageError.value = '';
        urlError.value = '';
        statusError.value = '';        
        
        if (!imageInput.value) {
            imageError.value = 'Image is required';
            isValid = false;
        }  

        if (!urlInput.value) {
            urlError.value = 'url  is required';
            isValid = false;
        }

        if (!statusInput.value) {
            statusError.value = 'Status is required';
            isValid = false;
        }

        return isValid;
    };

    // clickAdd
    const clickAdd = async () => 
    {
        if (!validateFields()) {
            return; // Stop if form is invalid
        }

        try {
          // upload image licenses
          const { data:uploadImage } = await useFetch("/api/rehab-center/ads/upload", {
            method: 'POST',
            body: {
              base64Data: imageFile.value,
              fileName: imageFileName.value,              
            },
          });

          if(uploadImage.value.respond == 200) 
          {          
            const { data: add } = await useFetch("/api/rehab-center/ads/create", {
                method: "POST",
                body: JSON.stringify({  
                    user_id : id,
                    imageInput:uploadImage.value.data.filePath,
                    urlInput:urlInput.value,
                    statusInput:statusInput.value,
                }),
            });        
            // alert(JSON.stringify(add.value));
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
                alert("Advertising failed to create.");
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
            console.error("Failed to created advertising", error);
            alert("An error occurred while created advertising details. Please try again.");
        }
    };

    // edit
    const editButton = async  (id) =>
    {       
      selectedAdvertising.value=id;
        try {
            const { data: detail } = await useFetch("/api/rehab-center/ads/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });
            // alert(JSON.stringify(detail.value));
            if (detail.value.response === 200) 
            {
                
                imageInputEdit.value=detail.value.data.advertising_image;
                urlInput.value=detail.value.data.advertising_media_url;                
                statusInput.value=detail.value.data.advertising_status;
                modalEdit.value = true;
            } 
            else 
            {
                alert("Advertising not found.");
            }
        } 
        catch (error) 
        {
            console.error("Failed to fetch advertising details: 1", error);
            alert("An error occurred while fetching advertising details. Please try again.");
        }
    };

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => 
    {
        imageInput.value=imageInputEdit.value;
        
        if(imageFile2.value)
        {
          alert(imageFile2.value);
            const { data:uploadImage } = await useFetch("/api/rehab-center/ads/upload", {
            method: 'POST',
            body: {
                base64Data: imageFile2.value,
                fileName: imageFileName2.value,              
            },
            });

            if(uploadImage.value.respond == 200) 
            {
                imageInput.value = uploadImage.value.data.filePath;
            }
        }      
        else
        {
          alert('kosong');
        }
        // alert(imageInputEdit.value);
        try {
            const { data: update } = await useFetch("/api/rehab-center/ads/update", {
                method: "POST",
                body: JSON.stringify({  
                    advertisingID : selectedAdvertising.value,
                    imageInput:imageInput.value,
                    urlInput:urlInput.value,
                    statusInput:statusInput.value
                })
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
                alert("Advertising failed to update.");
            }
            
        } 
        catch (error) {
            console.error("Failed to updated advertising details:", error);
            alert("An error occurred while updated advertising details. Please try again.");
        }
    };

    //delete
    const closeDelete= () =>{
      modalDelete.value = false;
    };
    
    const confirmDelete = (id) => {
        selectedAdvertising.value = id;
        modalDelete.value = true;
    };
    
    const clickDelete = async () => 
    {
      try {
        const { data:deleted} = await useFetch("/api/rehab-center/ads/delete", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedAdvertising.value,
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
            alert("Advertising failed to update.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to updated advertising details:", error);
          alert("An error occurred while updated advertising details. Please try again.");
      }
        advertisings.value = advertisings.value.filter(advertising => advertising.id !== selectedAdvertising.value.id);
        modalDelete.value = false;
        selectedAdvertising.value = null;
    };

    const statusOptions = ref([]);
    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    statusOptions.value = lookupData.data.filter(item => item.lookupType == 'ads_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    statusOptions.value.unshift({ value: "", label: "Please choose" });


</script>

<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Advertising Management
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
              <span class="block font-semibold text-xl leading-tight"> {{ advertising.data.value.data.user.userFullName }}</span>
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
              <span class="block font-semibold text-xl leading-tight"> {{ advertisings.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Advertisings
              </span>
            </div>
          </div>
        </rs-card>
      </div>
      <!-- List of advertisings -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Advertisings </div>
          <div class="flex justify-end items-center mb-3 gap-5">
            
            <rs-button variant="primary" @click="openAdd">            
              <Icon name="solar:add-square-broken" class="mr-2" /> Add Advertising
            </rs-button>
            <rs-modal title="Add Advertising" v-model="modalAdd" size="lg" position="center" :overlayClose="false">
                <template v-slot:header>
                Add Advertising
                </template>
                <template v-slot:body>
                <form>
                    
                    <!-- Image Upload -->
                    <div class="mb-4">
                    <FormKit type="file" label="Image *" v-model="imageInput" :class="{'border-red-500': imageError}" accept="image/*" @change="onChangeFile" required />
                    <p v-if="imageError" class="text-red-500 text-sm">{{ imageError }}</p>
                    </div>                    

                    <!-- PIC Name Input -->
                    <div class="mb-4">
                        <FormKit type="url" label="URL" v-model="urlInput" :class="{'border-red-500': urlError}" placeholder="URL" />
                        <p v-if="urlError" class="text-red-500 text-sm">{{ urlError }}</p>
                    </div>                 

                    <!-- Status Dropdown -->
                    <div class="mb-4">
                    <FormKit type="select" label="Status *" v-model="statusInput" :class="{'border-red-500': statusError}" :options="statusOptions" required />
                    <p v-if="statusError" class="text-red-500 text-sm">{{ statusError }}</p>
                    </div>
                </form>
                </template>
                <template v-slot:footer>
                <rs-button @click="closeAdd">Cancel</rs-button>
                <rs-button @click="clickAdd">Add</rs-button>
                </template>
            </rs-modal>
          </div>
  
          <rs-table v-if="advertisings.length > 0"
            :data="advertisings"
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
    <!-- const field =['image' ,'url','status', 'action']; -->

            <template #image ="advertisings" >
              <img :src="apiURL+ advertisings.value.advertising_image" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
            </template>
            <template #url ="advertisings" >
                  {{ advertisings.value.advertising_media_url}}
            </template>          
            <template #status ="advertisings" >
                  {{ advertisings.value.lookup.lookupValue}}
            </template>
            
            <template #action="advertisings">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(advertisings.value.advertising_id)">
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Edit
                </rs-button>
                <rs-modal title="Edit Advertising" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Advertising
                  </template>
                  <template v-slot:body>
                    <form>                                             
                       <!-- Image Upload -->
                        <div class="mb-4">
                            <img :src="apiURL+ imageInputEdit" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
                            <FormKit type="file" label="Image *" v-model="imageFile2" :class="{'border-red-500': imageError}" accept="image/*" @change="onChangeFile2" required />
                            <p v-if="imageError" class="text-red-500 text-sm">{{ imageError }}</p>
                        </div>                

                      <!-- PIC Name Input -->
                      <div class="mb-4">
                          <FormKit type="url" label="URL" v-model="urlInput" :class="{'border-red-500': urlError}" placeholder="URL" />
                          <p v-if="urlError" class="text-red-500 text-sm">{{ urlError }}</p>
                      </div>                 

                      <!-- Status Dropdown -->
                      <div class="mb-4">
                        <FormKit type="select" label="Status *" v-model="statusInput" :class="{'border-red-500': statusError}" :options="statusOptions" required />
                        <p v-if="statusError" class="text-red-500 text-sm">{{ statusError }}</p>
                      </div>
                    </form>
                    
                  </template>
                  <template v-slot:footer >
                    <rs-button @click="closeEdit">Cancel</rs-button>
                    <rs-button @click="clickUpdate">Update</rs-button>
                  </template>
                </rs-modal>
                <rs-button variant="danger" @click="confirmDelete(advertisings.value.advertising_id)">
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
          Are you sure you want to delete this advertising?
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

  