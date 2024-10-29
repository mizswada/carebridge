<script setup>
    definePageMeta({
        title: "View Rehab Center ",
    });

    const { $swal, $router } = useNuxtApp();
    const config = useRuntimeConfig();
    const apiURL = config.public.uploadURL;
    // console.log("apiURL: ", apiURL);

    // Editing mode toggle
    const isEditing = ref(false);
    const id = useRoute().params.id;

    // Define form data
    const formData = ref({
        userUsername: '',
        userPassword: '',
        userFullName: '',
        userEmail: '',
        userPhone: '',
        center_category: '',
        center_address_line1: '',
        center_address_line2: '',
        center_address_city: '',
        center_address_postcode: '',
        center_address_state: '',
        center_address_country: '',
        registration_number: '',
        license_number: '',
        contact_number: '',
        email_address: '',
        center_type: '',
        person_in_charge: '',
        center_capacity: '',
        operational_hours: '',
        website: '',
        document_licenses: null,
        documents_certificate: null,
        document_licensesEdit: null,
        document_logoEdit: null,
        document_logo:null,
        documents_certificatesEdit: null,
        document_licenses: null,
        documents_certificates: null,
        center_description: '',
        geolocation: '',
        licensesFile :null,
        licensesFileName :null,
        certificatesFile :null,
        certificatesFileName :null,
        logoFile :null,
        logoFileName :null,
    });

    // Dropdown options
    const categories = ref([]);
    const states = ref([]);
    const countries = ref([]);
    const associationTypes = ref([]);

    // Toggle edit mode
    const toggleEditMode = () => {
        isEditing.value = !isEditing.value;
    };

    // Fetch dropdown options on mounted
    onMounted(async () => {
        // Fetch categories (rehab_center type only)
        const categoryData = await $fetch('/api/rehab-center/category', {
            method: 'GET'
        });
        categories.value = categoryData.data.map(category => ({ value: category.category_id, label: category.name }));
        categories.value.unshift({ value: "", label: "Please choose" });

        // Fetch lookup data for states, countries, and association types
        const lookupData = await $fetch('/api/lookup', {
            method: 'GET'
        });
        states.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
        states.value.unshift({ value: "", label: "Please choose" });

        countries.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
        countries.value.unshift({ value: "", label: "Please choose" });

        associationTypes.value = lookupData.data.filter(item => item.lookupType === 'associationType_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
        associationTypes.value.unshift({ value: "", label: "Please choose" });
    });

    // Get details
    const { data: detail } = await useFetch("/api/rehab-center/get", {
      method: "GET",
      query: {
        id: parseInt(id),
      },
    });

    // alert(JSON.stringify(detail.value));
    if (detail.value.response === 200)
    {
      formData.value.userFullName = detail.value.data.user.userFullName;
      formData.value.userEmail = detail.value.data.user.userEmail;
      formData.value.userPhone = detail.value.data.user.userPhone;
      if(detail.value.data.details != null)
      {
        formData.value.center_category = detail.value.data.details.center_category;
        formData.value.center_address_line1 = detail.value.data.details.center_address_line1;
        formData.value.center_address_line2 = detail.value.data.details.center_address_line2;
        formData.value.center_address_city = detail.value.data.details.center_address_city;
        formData.value.center_address_postcode = detail.value.data.details.center_address_postcode;
        formData.value.center_address_state = detail.value.data.details.center_address_state;
        formData.value.center_address_country = detail.value.data.details.center_address_country;
        formData.value.registration_number = detail.value.data.details.registration_number;
        formData.value.license_number = detail.value.data.details.license_number;  
        formData.value.contact_number = detail.value.data.details.contact_number;
        formData.value.email_address = detail.value.data.details.email_address;
        formData.value.center_type = detail.value.data.details.center_type;
        formData.value.person_in_charge = detail.value.data.details.person_in_charge;
        formData.value.center_capacity = detail.value.data.details.center_capacity;
        formData.value.operational_hours = detail.value.data.details.operational_hours;
        formData.value.website = detail.value.data.details.website;
        formData.value.document_logo = detail.value.data.details.documents_logo;
        formData.value.document_licenses = detail.value.data.details.documents_Licenses;
        formData.value.documents_certificates = detail.value.data.details.documents_certificates;
        formData.value.center_description = detail.value.data.details.center_description;
        formData.value.geolocation = detail.value.data.details.geolocation;
      }
      
    }

    // Form submission handler
    const submitForm = async () => 
    {
      // alert(formData.value.logoFile);
      try {
        if(formData.value.licensesFile)
        {
            const { data:uploadImageLicenses } = await useFetch("/api/rehab-center/upload", {
            method: 'POST',
            body: {
              base64Data: formData.value.licensesFile,
              fileName: formData.value.licensesFileName,              
            },
          });

          if(uploadImageLicenses.value.respond == 200) 
          {
            formData.value.document_licenses = uploadImageLicenses.value.data.filePath;
            console.log("path1:", uploadImageLicenses.value.data.filePath);   
          }
          else 
          {
            $swal.fire({
              position: "center",
              icon: "error",
              title: "Error",
              text: " Fail to upload licences.",
            });
          }
        }
        
        if(formData.value.certificatesFile)
        {
          const { data:uploadImageCertificates } = await useFetch("/api/rehab-center/upload", {
            method: 'POST',
            body: {
              base64Data: formData.value.certificatesFile,
              fileName: formData.value.certificatesFileName,              
            },
          });

          if(uploadImageCertificates.value.respond == 200) 
          {
            formData.value.documents_certificates = uploadImageCertificates.value.data.filePath;
            console.log("path2:", uploadImageCertificates.value.data.filePath);     
          }
        }

        if(formData.value.logoFile)
        {
          const { data:uploadImageLogo } = await useFetch("/api/rehab-center/upload", {
            method: 'POST',
            body: {
              base64Data: formData.value.logoFile,
              fileName: formData.value.logoFileName,              
            },
          });

          if(uploadImageLogo.value.respond == 200) 
          {
            formData.value.document_logo = uploadImageLogo.value.data.filePath;
            // alert(formData.value.document_logo);
          }
        }

        

        // console.log("body:", formData.value);     
        
        const { data: edit } = await useFetch('/api/rehab-center/update', {
            initialCache: false,
            method: 'POST',
            body: JSON.stringify({
              userUsername: formData.value.userUsername,
              userPassword: formData.value.userPassword,
              userFullName: formData.value.userFullName ,
              userEmail: formData.value.userEmail ,
              userPhone: formData.value.userPhone ,
              center_category: formData.value.center_category ,
              center_address_line1: formData.value.center_address_line1 ,
              center_address_line2: formData.value.center_address_line2 ,
              center_address_city: formData.value.center_address_city ,
              center_address_postcode: formData.value.center_address_postcode ,
              center_address_state: formData.value.center_address_state ,
              center_address_country: formData.value.center_address_country ,
              registration_number: formData.value.registration_number ,
              license_number: formData.value.license_number ,
              contact_number: formData.value.contact_number ,
              email_address: formData.value.email_address ,
              center_type: formData.value.center_type ,
              person_in_charge: formData.value.person_in_charge ,
              center_capacity: formData.value.center_capacity ,
              operational_hours: formData.value.operational_hours ,
              website: formData.value.website ,
              document_licenses: formData.value.document_licenses,
              documents_certificates: formData.value.documents_certificates,
              document_logo:formData.value.document_logo,
              center_description: formData.value.center_description ,
              geolocation: formData.value.geolocation ,
              id: useRoute().params.id,
            })
        });
        // alert(JSON.stringify(edit.value));
        if (edit.value.response === 200) 
        {
          $swal.fire({
              position: "center",
              title: "Success",
              text: 'Rehab center updated successfully!',
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
          });

          setTimeout(() => {
            $router.go();
          }, 1000);
        }
        else 
        {
          $swal.fire({
              icon: "error",
              title: "Error",
              text: add.value.error || 'An unexpected error occurred.',
          });
        }
      }
      catch (error) 
      {
          alert("An error occurred while submitting the form.");
      }
    };

    //license
    const onChangeFile = async (event) => {      
      const file = event.target.files[0];  // Get the first file from the input
      const fileType = file.type;
      try {
        if (fileType.startsWith('image/')) {
          const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
          const base64Data = await ToBase64OpsImage(compressedImage);

          formData.value.licensesFile = base64Data;  // Store the file in your form data
          formData.value.licensesFileName = file.name;
        }
        else if (fileType === 'application/pdf') {
          const base64Data = await ToBase64OpsImage(file);

          formData.value.licensesFile = base64Data;  // Store the file in your form data
          formData.value.licensesFileName = file.name;
        }
        else {
          // console.error("Unsupported file format.");
          $swal.fire({
            position: "center",
            icon: "error",
            title: "Unsupported Format",
            text: "Only images and PDF documents are supported.",
          });
        }
      } catch (error) {
        $swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "An error occurred while processing the file.",
        });
      } 
    };

     //logo
    const onChangeFile3 = async (event) => {      
      
      const file3 = event.target.files[0];  // Get the first file from the input
      const fileType3 = file3.type;
      try {
        
        if (fileType3.startsWith('image/')) {
          const compressedImage3 = await resizeAndCompressImage(file3, 800, 600, 0.7);
          const base64Data3 = await ToBase64OpsImage(compressedImage3);
          
          formData.value.logoFile = base64Data3;  // Store the file in your form data
          formData.value.logoFileName = file3.name; 
          // alert(formData.value.logoFile);
        }
        else if (fileType3 === 'application/pdf') {
          const base64Data3 = await ToBase64OpsImage(file3);

          formData.value.logoFile = base64Data3;  // Store the file in your form data
          formData.value.logoFileName = file3.name;
        }
        else {
          // console.error("Unsupported file format.");
          $swal.fire({
            position: "center",
            icon: "error",
            title: "Unsupported Format",
            text: "Only images and PDF documents are supported.",
          });
        }
      } catch (error)  {
        $swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "An error occurred while processing the file.",
        });
      } 
      
    };

    //certificate
    const onChangeFile2 = async (event) => {      
      const file = event.target.files[0];  // Get the first file from the input
      const fileType = file.type;

      try {
        
        if (fileType.startsWith('image/')) {
          const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
          const base64Data2 = await ToBase64OpsImage(compressedImage);
          
          formData.value.certificatesFile = base64Data2;  // Store the file in your form data
          formData.value.certificatesFileName = file.name; 
        }
        else if (fileType === 'application/pdf') {
          const base64Data2 = await ToBase64OpsImage(file);

          formData.value.certificatesFile = base64Data2;  // Store the file in your form data
          formData.value.certificatesFileName = file.name;
        }
        else {
          // console.error("Unsupported file format.");
          $swal.fire({
            position: "center",
            icon: "error",
            title: "Unsupported Format",
            text: "Only images and PDF documents are supported.",
          });
        }
      } catch (error)  {
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

    
</script>

<template>
  <!-- First Row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
    <nuxt-link :to="`/rehab-center/list/ads/`+id">
      <!-- Summary Card #1 -->
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-yellow-100 rounded-2xl"
          >
            <Icon
              class="text-yellow-500"
              name="icon-park-solid:google-ads"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ detail.data.adsCount }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Ads
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>

    <nuxt-link :to="`/rehab-center/list/activity/`+id">
      <!-- Summary Card #1 -->
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
          >
            <Icon
              class="text-indigo-500"
              name="material-symbols:list-alt-check"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ detail.data.activityCount }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Activity
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>
    
    <nuxt-link :to="`/rehab-center/list/equipment/`+id">
      <!-- Summary Card #2 -->
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-teal-100 rounded-2xl"
          >
            <Icon
              class="text-teal-500"
              name="material-symbols:list-alt-check"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ detail.data.equipmentCount }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Equipment
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>
  </div>

  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold" v-if="!isEditing" >View Rehab Center</h2>
      <h2 class="text-xl font-semibold" v-else >Update Rehab Center</h2>
    </div>
    <div class="flex justify-end items-center mb-3 gap-2">
      <nuxt-link :to="`/rehab-center/list/ads/`+id">
        <rs-button variant="warning">
            <Icon name="icon-park-solid:google-ads" class="mr-2 " /> Ads             
        </rs-button>
      </nuxt-link>
        <nuxt-link :to="`/rehab-center/list/activity/`+id">
          <rs-button variant="info">
              <Icon name="material-symbols:list-alt-outline-rounded" class="mr-2 " /> Activity             
          </rs-button>
        </nuxt-link>
        <nuxt-link :to="`/rehab-center/list/equipment/`+id">
            <rs-button variant="success">
                <Icon name="ep:tools" class="mr-2 " /> Equipment             
            </rs-button>
        </nuxt-link>
        <rs-button variant="primary" @click="toggleEditMode">
          <Icon name="solar:pen-new-square-broken" class="mr-2" /> 
          {{ isEditing ? 'Cancel' : 'Edit' }}
        </rs-button>
    </div>
    

    <form @submit.prevent="submitForm">
      <!-- Center Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="select" v-model="formData.center_category" :options="categories" :disabled="!isEditing" required>
          <template #label>
            Center Category<span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.center_type" :options="associationTypes" :disabled="!isEditing" required>
          <template #label>
            Center Type <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <!-- Other fields... (example for text input) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="formData.userFullName" :disabled="!isEditing" required>
          <template #label>
            Full Name <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="email" v-model="formData.userEmail" :disabled="!isEditing" required>
          <template #label>
            Email <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="tel" v-model="formData.userPhone" :disabled="!isEditing" required>
          <template #label>
            Phone <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="textarea" v-model="formData.center_description" class="md:col-span-2" :disabled="!isEditing" required>
          <template #label>
            Description <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.geolocation" required class="md:col-span-2" :disabled="!isEditing">
          <template #label>
            Geolocation <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="text" v-model="formData.registration_number" :disabled="!isEditing" required>
          <template #label>
            Registration Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.license_number"  :disabled="!isEditing" required>
          <template #label>
            License Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <!-- Address Fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="select" v-model="formData.center_address_country" :options="countries" :disabled="!isEditing" required>
          <template #label>
            Country <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.center_address_state" :options="states" :disabled="!isEditing" required>
          <template #label>
            State <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.center_address_postcode" :disabled="!isEditing" required>
          <template #label>
            Postcode <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="formData.center_address_line1"  :disabled="!isEditing" required>
          <template #label>
            Address Line 1 <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.center_address_line2" :disabled="!isEditing">
          <template #label>
            Address Line 2
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.center_address_city" :disabled="!isEditing" required>
          <template #label>
            City <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      <!-- Contact Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="formData.contact_number" :disabled="!isEditing" required>
          <template #label>
            Contact Number (PIC) <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="email" v-model="formData.email_address" :disabled="!isEditing" required>
          <template #label>
            Email Address (PIC) <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.person_in_charge" :disabled="!isEditing" required>
          <template #label>
            Person in Charge (PIC) <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="number" v-model="formData.center_capacity" :disabled="!isEditing" >
          <template #label>
            Center Capacity
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.operational_hours" :disabled="!isEditing" required>
          <template #label>
            Operational Hours <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="url" v-model="formData.website" :disabled="!isEditing"  required>
          <template #label>
            Website <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="file" v-model="formData.document_logoEdit" accept="image/*" :disabled="!isEditing" @change="onChangeFile3" >
          <template #label>
            Logo  <span class="text-red-500"></span>
          </template>
          <template #help v-if="formData.document_logo">              
            <img :src="apiURL+ formData.document_logo" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
          </template>
        </FormKit>
        <FormKit type="file" v-model="formData.document_licensesEdit" accept="image/*" :disabled="!isEditing" @change="onChangeFile" >
          <template #label>
            License  <span class="text-red-500"></span>
          </template>
          <template #help v-if="formData.document_licenses">              
            <img :src="apiURL+ formData.document_licenses" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />

          </template>
        </FormKit>
        <FormKit type="file" v-model="formData.documents_certificatesEdit" accept="image/*" :disabled="!isEditing" @change="onChangeFile2" >
          <template #label>
            Certificates  <span class="text-red-500"></span>
          </template>
          <template #help v-if="formData.documents_certificates">              
            <img :src="apiURL+ formData.documents_certificates" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
          </template>
        </FormKit>
      </div>

      

      
      
      <!-- Submit Button (only show if editing) -->
      <div v-if="isEditing" class="md:col-span-2 mt-6">
        <rs-button variant="primary" type="submit">Save Changes</rs-button>
      </div>
    </form>
  </div>
</template>

<style scoped>
  /* Additional styling can be applied here */
</style>
