<script setup>
  definePageMeta({
      title: "View Association ",
  });

  const { $swal, $router } = useNuxtApp();
  const config = useRuntimeConfig();
  const apiURL = config.public.uploadURL;
  // Editing mode toggle
  const isEditing = ref(false);
  const id = useRoute().params.id;

  // Define form data
  const formData = ref({
    userUsername: '',
    userPassword: '',
    category_code:'',
    secret_key:'',
    userFullName: '',
    userEmail: '',
    userPhone: '',

    association_category: '',
    registration_number: '',
    license_number: '',
    membership: '',
    establishment_date: '',
    association_type: '',
    objective: '',
    website: '',
    document_logo: null,
    document_logoEdit: null,
    operational_areas: '',

    association_address_line1: '',
    association_address_line2: '',
    association_address_city: '',
    association_address_postcode: '',
    association_address_state: '',
    association_address_country: '',        
    contact_number: '',
    email_address: '',        
    person_in_charge: '',    
    document_licenses: null,
    documents_certificates: null,        
    document_licensesEdit: null,
    documents_certificatesEdit: null,  
    
    logoFile :null,
    logoFileName :null,
    licensesFile :null,
    licensesFileName :null,
    certificatesFile :null,
    certificatesFileName :null,
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
      const categoryData = await $fetch('/api/association/category', {
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
    return `${year}-${month}-${day}`;
  };

  // Get details
  const { data: detail } = await useFetch("/api/association/get", {
    method: "GET",
    query: {
      id: parseInt(id),
    },
  });

  // alert(JSON.stringify(detail.value));
  if (detail.value.response === 200)
  {
    formData.value.category_code = detail.value.data.user.userCategoryCode;
    formData.value.secret_key = detail.value.data.user.userSecretKey;
    formData.value.userFullName = detail.value.data.user.userFullName;
    formData.value.userEmail = detail.value.data.user.userEmail;
    formData.value.userPhone = detail.value.data.user.userPhone;
    if(detail.value.data.details != null)
    {
      formData.value.association_category = detail.value.data.details.association_category;
      formData.value.registration_number = detail.value.data.details.registration_number;
      formData.value.license_number = detail.value.data.details.license_number;
      formData.value.membership = detail.value.data.details.membership_details;
      formData.value.establishment_date = formatDate(detail.value.data.details.establishment_date);
      formData.value.association_type = detail.value.data.details.association_type;
      formData.value.objective = detail.value.data.details.objectives;
      formData.value.website = detail.value.data.details.website;
      formData.value.document_logo = detail.value.data.details.association_logo;
      formData.value.operational_areas = detail.value.data.details.operational_area;
      
      formData.value.association_address_line1 = detail.value.data.details.association_address_line1;
      formData.value.association_address_line2 = detail.value.data.details.association_address_line2;
      formData.value.association_address_city = detail.value.data.details.association_address_city;
      formData.value.association_address_postcode = detail.value.data.details.association_address_postcode;
      formData.value.association_address_state = detail.value.data.details.association_address_state;
      formData.value.association_address_country = detail.value.data.details.association_address_country;
        
      formData.value.contact_number = detail.value.data.details.pic_phoneNum;
      formData.value.email_address = detail.value.data.details.pic_email;
      formData.value.person_in_charge = detail.value.data.details.pic_name;
      formData.value.document_licenses = detail.value.data.details.document_licenses;
      formData.value.documents_certificates = detail.value.data.details.documents_certificates;
    }
  }

  // Form submission handler
  const submitForm = async () => {
      try {

      if(formData.value.document_logoEdit)
      {
        const { data:uploadImageLogo } = await useFetch("/api/association/upload", {
          method: 'POST',
          body: {
            base64Data: formData.value.logoFile,
            fileName: formData.value.logoFileName,              
          },
        });

        if(uploadImageLogo.value.respond == 200) 
        {
          formData.value.document_logo = uploadImageLogo.value.data.filePath;
        }
      }

      if(formData.value.document_licensesEdit)
      {
        const { data:uploadImageLicenses } = await useFetch("/api/association/upload", {
          method: 'POST',
          body: {
            base64Data: formData.value.licensesFile,
            fileName: formData.value.licensesFileName,              
          },
        });

        if(uploadImageLicenses.value.respond == 200) 
        {
          formData.value.document_licenses = uploadImageLicenses.value.data.filePath;
        }
      }

      if(formData.value.documents_certificatesEdit)
      {
        const { data:uploadImageCertificates } = await useFetch("/api/association/upload", {
          method: 'POST',
          body: {
            base64Data: formData.value.certificatesFile,
            fileName: formData.value.certificatesFileName,              
          },
        });

        if(uploadImageCertificates.value.respond == 200) 
        {
          formData.value.documents_certificates = uploadImageCertificates.value.data.filePath;
        }
      }

      const { data: add } = await useFetch('/api/association/update', {
          initialCache: false,
          method: 'POST',
          body: JSON.stringify({
            ...formData.value,
            id: parseInt(useRoute().params.id),
          })
      });
      // alert(JSON.stringify(add.value));
      if (add.value.response === 200) {
          $swal.fire({
              position: "center",
              title: "Success",
              text: 'Association updated successfully!',
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
          });
          setTimeout(() => {
            $router.go();
          }, 1000);
      } else {
          $swal.fire({
              icon: "error",
              title: "Error",
              text: add.value.error || 'An unexpected error occurred.',
          });
      }
      } catch (error) {
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

  //logo
  const onChangeFile3 = async (event) => {      
    const file = event.target.files[0];  // Get the first file from the input
    const fileType = file.type;

    try {
      
      if (fileType.startsWith('image/')) {
        const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
        const base64Data3 = await ToBase64OpsImage(compressedImage);
        
        formData.value.logoFile = base64Data3;  // Store the file in your form data
        formData.value.logoFileName = file.name; 
      }
      else if (fileType === 'application/pdf') {
        const base64Data3 = await ToBase64OpsImage(file);

        formData.value.logoFile = base64Data3;  // Store the file in your form data
        formData.value.logoFileName = file.name;
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
    <nuxt-link :to="`/association/list/activity/`+id">
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
    <nuxt-link :to="`/association/list/equipment/`+id">
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
    <nuxt-link :to="`/association/list/donation/`+id">
      <!-- Summary Card #2 -->
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-yellow-100 rounded-2xl"
          >
            <Icon
              class="text-yellow-500"
              name="solar:hand-money-outline"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">RM {{ detail.data.donationSum }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Donation
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>
  </div>

  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-between items-right mb-6">
      <h2 class="text-xl font-semibold" v-if="!isEditing" >View Association</h2>
      <h2 class="text-xl font-semibold" v-else >Update Association</h2>
    </div>
    <div class="flex flex-col md:flex-row justify-center md:justify-end items-center mb-3 gap-2">
      <nuxt-link :to="`/association/list/activity/`+id">
        <rs-button variant="info">
            <Icon name="material-symbols:list-alt-outline-rounded" class="mr-2 " /> Activity             
        </rs-button>
      </nuxt-link>
      <nuxt-link :to="`/association/list/equipment/`+id">
          <rs-button variant="success">
              <Icon name="ep:tools" class="mr-2 " /> Equipment             
          </rs-button>
      </nuxt-link>
      <nuxt-link :to="`/association/list/donation/`+id">
          <rs-button variant="warning">
              <Icon name="solar:hand-money-outline" class="mr-2 " /> Donation             
          </rs-button>
      </nuxt-link>
      <rs-button variant="primary" @click="toggleEditMode">
        <Icon name="solar:pen-new-square-broken" class="mr-2" /> 
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </rs-button>
    </div>

    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="text" v-model="formData.secret_key" :disabled="!isEditing" required>
          <template #label>
            User Secret Key <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.category_code" :disabled="!isEditing" required>
          <template #label>
            User Category code <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

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
      <!-- Center Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="select" v-model="formData.association_category" :options="categories" :disabled="!isEditing" required>
          <template #label>
            Association Category<span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.association_type" :options="associationTypes" :disabled="!isEditing" required>
          <template #label>
            Association Type <span class="text-red-500">*</span>
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="textarea" v-model="formData.objective" class="md:col-span-2"  :disabled="!isEditing" required>
          <template #label>
            Objective <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="textarea" v-model="formData.membership"  class="md:col-span-2" :disabled="!isEditing" required>
          <template #label>
            Membership <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="date" v-model="formData.establishment_date" :disabled="!isEditing">
          <template #label>
            Establishment Date
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.operational_areas" :disabled="!isEditing" required>
          <template #label>
            Operational Areas <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="url" v-model="formData.website" :disabled="!isEditing" required>
          <template #label>
            Website <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>        

      <!-- Address Fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="select" v-model="formData.association_address_country" :options="countries" :disabled="!isEditing" required>
          <template #label>
            Country <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.association_address_state" :options="states" :disabled="!isEditing" required>
          <template #label>
            State <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.association_address_postcode" :disabled="!isEditing" required>
          <template #label>
            Postcode <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="formData.association_address_line1"  :disabled="!isEditing" required>
          <template #label>
            Address Line 1 <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.association_address_line2" :disabled="!isEditing">
          <template #label>
            Address Line 2
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.association_address_city" :disabled="!isEditing" required>
          <template #label>
            City <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      <!-- Contact Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Contact Info -->
        <FormKit type="text" v-model="formData.person_in_charge" :disabled="!isEditing" required>
          <template #label>
            Person in Charge Name <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="tel" v-model="formData.contact_number" :disabled="!isEditing" required>
          <template #label>
            PIC Contact Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="email" v-model="formData.email_address" :disabled="!isEditing" required>
          <template #label>
            PIC Email Address  <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="file" v-model="formData.document_logoEdit" @change="onChangeFile3" :disabled="!isEditing" >
          <template #label>
            Logo <span class="text-red-500">*</span>
          </template>
          <template #help v-if="detail.data.details != null">              
            <img :src="apiURL+ detail.data.details.association_logo" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
          </template>
         
        </FormKit> 

        <FormKit type="file" v-model="formData.document_licensesEdit" :disabled="!isEditing" @change="onChangeFile" >
          <template #label >
            License Documents  <span class="text-red-500"></span>
          </template>
          <template #help v-if="detail.data.details != null">              
            <img :src="apiURL+ detail.data.details.document_licenses" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
          </template>
        </FormKit>
        
        <FormKit type="file" v-model="formData.documents_certificatesEdit" :disabled="!isEditing"  @change="onChangeFile2">
          <template #label>
            Certificates  <span class="text-red-500"></span>
          </template>
          <template #help v-if="detail.data.details != null">              
            <img :src="apiURL+ detail.data.details.documents_certificates" alt="Image Preview" class="w-32 h-32 object-cover mt-4" />
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
