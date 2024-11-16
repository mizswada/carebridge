<script setup>
    definePageMeta({
        title: "Equipment Management",
    });
    const { $swal, $router } = useNuxtApp();
    const id = useRoute().params.id;

    const config = useRuntimeConfig();
    const apiURL = config.public.uploadURL;
    // console.log("apiURL: ", apiURL);

    const modalEdit = ref(false);
    const modalAdd = ref(false);
    const modalDelete = ref(false);
    const selectedEquipment = ref(null);
    const equipments = ref(null);
    const field =['Name' ,'type','PIC','status', 'createdAt','action'];
    
    const editInput = ref('');

    const nameInput = ref('');
    const typeInput = ref('');
    const priceInput= ref(0);
    const imageInput=ref('');
    const descriptionInput = ref('');
    const namePIC = ref('');
    const phonePIC=ref('');
    const statusInput= ref('');    
    
    const imageFile=ref('');
    const imageFileName=ref('');
    const imageInputEdit= ref('');
    const imageFile2=ref('');
    const imageFileName2=ref('');

    const nameError = ref('');
    const typeError = ref('');
    const priceError = ref('');
    const imageError = ref('');
    const descriptionError = ref('');
    const namePICError = ref('');
    const phonePICError = ref('');
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
    const equipment = await useFetch("/api/caretaker/equipment/list", {
        method: "GET",
        query: {
            id: parseInt(id),
        },
    });
    // alert(JSON.stringify(equipment.data.value));
    // const equipment = await useFetch('/api/caretaker/equipment/list');
    if(equipment.data.value.response == 200)
    {
        equipments.value = equipment.data.value.data.equipments;
    }
    else
    {
        alert("An error occurred while fetching equipments. Please try again.");
    }
    //add

    const openAdd = () =>{
        modalAdd.value=true;
        typeInput.value = null;
        imageInput.value = null;               
        descriptionInput.value = null;
        namePIC.value= null;
        phonePIC.value = null;
        statusInput.value=null;
    };

    const closeAdd= () =>{
      modalAdd.value = false;
    };

    const validateFields = () => 
    {
        let isValid = true;
        // Reset errors
        nameError.value = '';
        typeError.value = '';
        priceError.value='';
        imageError.value = '';
        descriptionError.value = '';
        namePICError.value = '';
        phonePICError.value='';
        statusError.value = '';

        // Check each required field
        if (!nameInput.value) {
            nameError.value = 'Name is required';
            isValid = false;
        }
        
        if (!typeInput.value) {
            typeError.value = 'Equipment type is required';
            isValid = false;
        }
        if(typeInput.value != 23 && priceInput.value == 0){
            priceError.value = 'Price is required';
            isValid = false;
        }
        
        if (selectedEquipment.value == null && !imageInput.value) {
            imageError.value = 'Image is required';
            isValid = false;
        }
        if (!descriptionInput.value) {
            descriptionError.value = 'Description is required';
            isValid = false;
        }
        // if (!namePIC.value) {
        //     namePICError.value = 'PIC name is required';
        //     isValid = false;
        // }
        // if (!phonePIC.value) {
        //     phonePICError.value = 'PIC contact is required';
        //     isValid = false;
        // }

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
          const { data:uploadImage } = await useFetch("/api/caretaker/equipment/upload", {
            method: 'POST',
            body: {
              base64Data: imageFile.value,
              fileName: imageFileName.value,              
            },
          });

          if(uploadImage.value.respond == 200) 
          {         
            // alert('masuk');  
            const { data: add } = await useFetch("/api/caretaker/equipment/create", {
                method: "POST",
                body: JSON.stringify({  
                    user_id : id,
                    nameInput:nameInput.value,
                    typeInput:typeInput.value,
                    priceInput:priceInput.value,
                    imageInput:uploadImage.value.data.filePath,
                    descriptionInput:descriptionInput.value,
                    namePIC:namePIC.value,
                    phonePIC:phonePIC.value,
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
                alert("Equipment failed to create.");
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
            console.error("Failed to created equipment", error);
            alert("An error occurred while created equipment details. Please try again.");
        }
    };

    // edit
    const editButton = async  (id) =>
    {       
      selectedEquipment.value=id;
        try {
            const { data: detail } = await useFetch("/api/caretaker/equipment/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });
            // alert(JSON.stringify(detail.value.data.equipment_image));
            if (detail.value.response === 200) 
            {
                nameInput.value=detail.value.data.equipment_name;
                typeInput.value=detail.value.data.equipment_type;
                priceInput.value=detail.value.data.equipment_price;
                imageInputEdit.value=detail.value.data.equipment_image;
                descriptionInput.value=detail.value.data.equipment_description;
                namePIC.value=detail.value.data.equipment_pic_name;
                phonePIC.value=detail.value.data.equipment_pic_phoneNum;
                statusInput.value=detail.value.data.equipment_status;
                modalEdit.value = true;
            } 
            else 
            {
                alert("Equipment not found.");
            }
        } 
        catch (error) 
        {
            console.error("Failed to fetch equipment details: 1", error);
            alert("An error occurred while fetching equipment details. Please try again.");
        }
    };

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => 
    {
      if (!validateFields()) {
            return; // Stop if form is invalid
        }
        imageInput.value=imageInputEdit.value;
        if(imageFile2.value)
        {
            const { data:uploadImage } = await useFetch("/api/caretaker/equipment/upload", {
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
        // alert(imageInputEdit.value);
        try {
            const { data: update } = await useFetch("/api/caretaker/equipment/update", {
                method: "POST",
                body: JSON.stringify({  
                    equipmentID : selectedEquipment.value,
                    nameInput:nameInput.value,
                    typeInput:typeInput.value,
                    priceInput:priceInput.value,
                    imageInput:imageInput.value,
                    descriptionInput:descriptionInput.value,
                    namePIC:namePIC.value,
                    phonePIC:phonePIC.value,
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
                alert("Equipment failed to update.");
            }
            
        } 
        catch (error) {
            console.error("Failed to updated equipment details:", error);
            alert("An error occurred while updated equipment details. Please try again.");
        }
    };

    //delete
    const closeDelete= () =>{
      modalDelete.value = false;
    };
    
    const confirmDelete = (id) => {
        selectedEquipment.value = id;
        modalDelete.value = true;
    };
    
    const clickDelete = async () => 
    {
      try {
        const { data:deleted} = await useFetch("/api/caretaker/equipment/delete", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedEquipment.value,
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
            alert("Equipment failed to update.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to updated equipment details:", error);
          alert("An error occurred while updated equipment details. Please try again.");
      }
        equipments.value = equipments.value.filter(equipment => equipment.id !== selectedEquipment.value.id);
        modalDelete.value = false;
        selectedEquipment.value = null;
    };

    const statusOptions = ref([]);
    const typeOptions = ref([]);
    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    statusOptions.value = lookupData.data.filter(item => item.lookupType == 'equipment_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    statusOptions.value.unshift({ value: "", label: "Please choose" });

    typeOptions.value = lookupData.data.filter(item => item.lookupType == 'equipment_type').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    typeOptions.value.unshift({ value: "", label: "Please choose" });
    
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
        Equipment Management
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
              <span class="block font-semibold text-xl leading-tight"> {{ equipment.data.value.data.user.userFullName }}</span>
              <span class="text-base font-semibold text-gray-500">
                caretaker Name
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
              <span class="block font-semibold text-xl leading-tight"> {{ equipments.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Equipments
              </span>
            </div>
          </div>
        </rs-card>
      </div>
      <!-- List of equipments -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Equipments </div>
          <div class="flex justify-end items-center mb-3 gap-5">
            
            <rs-button variant="primary" @click="openAdd">            
              <Icon name="solar:add-square-broken" class="mr-2" /> Add Equipment
            </rs-button>
            <rs-modal title="Add Equipment" v-model="modalAdd" size="lg" position="center" :overlayClose="false">
                <template v-slot:header>
                Add Equipment
                </template>
                <template v-slot:body>
                <form>
                    <!-- Name Input -->
                    <div class="mb-4">
                    <FormKit type="text" label="Name *" v-model="nameInput" :class="{'border-red-500': nameError}" placeholder="Name" required />
                    <p v-if="nameError" class="text-red-500 text-sm">{{ nameError }}</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Type Dropdown -->
                    <div class="mb-4">
                    <FormKit type="select" label="Type *" v-model="typeInput" :class="{'border-red-500': typeError}" :options="typeOptions" required />
                    <p v-if="typeError" class="text-red-500 text-sm">{{ typeError }}</p>
                    </div>

                    <!-- Price Input -->
                    <div class="mb-4">
                    <FormKit type="text" label="Price *" v-model="priceInput" :class="{'border-red-500': priceError}" placeholder="RM 0" required />
                    <p v-if="priceError" class="text-red-500 text-sm">{{ priceError }}</p>
                    </div>
                </div>
                    <!-- Image Upload -->
                    <div class="mb-4">
                    <FormKit type="file" label="Image *" v-model="imageInput" :class="{'border-red-500': imageError}" accept="image/*" @change="onChangeFile" required />
                    <p v-if="imageError" class="text-red-500 text-sm">{{ imageError }}</p>
                    </div>

                    <!-- Description Input -->
                    <div class="mb-4">
                    <FormKit type="textarea" v-model="descriptionInput" :class="{'border-red-500': descriptionError}" placeholder="Equipment Description" rows="5" label="Description *" required />
                    <p v-if="descriptionError" class="text-red-500 text-sm">{{ descriptionError }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- PIC Name Input -->
                    <div class="mb-4">
                        <FormKit type="text" label="PIC Name" v-model="namePIC" :class="{'border-red-500': namePICError}" placeholder="PIC Name" />
                        <p v-if="namePICError" class="text-red-500 text-sm">{{ namePICError }}</p>
                    </div>

                    <!-- PIC Phone Input -->
                    <div class="mb-4">
                        <FormKit type="text" label="PIC Contact" v-model="phonePIC" :class="{'border-red-500': phonePICError}" placeholder="PIC Contact" />
                        <p v-if="phonePICError" class="text-red-500 text-sm">{{ phonePICError }}</p>
                    </div>
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
  
          <rs-table v-if="equipments.length > 0"
            :data="equipments"
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
          <template #Name ="equipments" >
                {{ equipments.value.equipment_name}}
          </template>
          <template #type ="equipments" >
                {{ equipments.value.lookup_equipment_equipment_typeTolookup.lookupValue}}
          </template>
          <template #PIC ="equipments" >
                {{ equipments.value.equipment_pic_name}}<br>
                {{ equipments.value.equipment_pic_phoneNum}}
          </template>
          <template #status ="equipments" >
                {{ equipments.value.lookup_equipment_equipment_statusTolookup.lookupValue}}
          </template>
          <template #createdAt ="equipments" >
                {{ formatDate(equipments.value.created_at)}}
          </template>
            <template #action="equipments">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(equipments.value.equipment_id)">
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Edit
                </rs-button>
                <rs-modal title="Edit Equipment" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Equipment
                  </template>
                  <template v-slot:body>
                    <form>
                        <div class="mb-4">
                            <FormKit type="text" label="Name *" v-model="nameInput" :class="{'border-red-500': nameError}" placeholder="Name" required />
                            <p v-if="nameError" class="text-red-500 text-sm">{{ nameError }}</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Type Dropdown -->
                            <div class="mb-4">
                                <FormKit type="select" label="Type *" v-model="typeInput" :class="{'border-red-500': typeError}" :options="typeOptions" required />
                                <p v-if="typeError" class="text-red-500 text-sm">{{ typeError }}</p>
                            </div>

                            <!-- Price Input -->
                            <div class="mb-4">
                                <FormKit type="text" label="Price *" v-model="priceInput" :class="{'border-red-500': priceError}" placeholder="RM 0" required />
                                <p v-if="priceError" class="text-red-500 text-sm">{{ priceError }}</p>
                            </div>
                        </div>

                        <!-- Image Upload -->
                        <div class="mb-4">
                            <img :src="apiURL+ imageInputEdit" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
                            <FormKit type="file" label="Image *" v-model="imageInput2" :class="{'border-red-500': imageError}" accept="image/*" @change="onChangeFile2" required />
                            <p v-if="imageError" class="text-red-500 text-sm">{{ imageError }}</p>
                            {{ apiURL }} {{ imageInputEdit }}
                        </div>

                        <!-- Description Input -->
                        <div class="mb-4">
                            <FormKit type="textarea" v-model="descriptionInput" :class="{'border-red-500': descriptionError}" placeholder="Equipment Description" rows="5" label="Description *" required />
                            <p v-if="descriptionError" class="text-red-500 text-sm">{{ descriptionError }}</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- PIC Name Input -->
                            <div class="mb-4">
                                <FormKit type="text" label="PIC Name" v-model="namePIC" :class="{'border-red-500': namePICError}" placeholder="PIC Name" />
                                <p v-if="namePICError" class="text-red-500 text-sm">{{ namePICError }}</p>
                            </div>

                            <!-- PIC Phone Input -->
                            <div class="mb-4">
                                <FormKit type="text" label="PIC Contact" v-model="phonePIC" :class="{'border-red-500': phonePICError}" placeholder="PIC Contact" />
                                <p v-if="phonePICError" class="text-red-500 text-sm">{{ phonePICError }}</p>
                            </div>
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
                <rs-button variant="danger" @click="confirmDelete(equipments.value.equipment_id)">
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
          Are you sure you want to delete this equipment?
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

  