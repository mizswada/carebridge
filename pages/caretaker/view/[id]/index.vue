<script setup>
  import { ref, onMounted } from 'vue';

  definePageMeta({
      title: "View Caretaker ",
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

          caretaker_category: '',
          caretaker_ic: '',
          caretaker_dob: '',
          membership: '',
          caretaker_nationality: '',
          caretaker_type: '',
          objective: '',
          website: '',
          profile_picture: null,
          operational_areas: '',

          caretaker_address_line1: '',
          caretaker_address_line2: '',
          caretaker_address_city: '',
          caretaker_address_postcode: '',
          caretaker_address_state: '',
          caretaker_gender: '',        
          contact_number: '',
          email_address: '',        
          person_in_charge: '',    
          documents_ic: null,
          documents_certificates: null,        
          
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
  const caretakerGender = ref([]);
  const caretakerNationality = ref([]);
  const caretaker_qualification = ref([]);
  const caretaker_workinghour = ref([]);
  const caretakerhealthstatus = ref([]);
  
  
  
  // Toggle edit mode
  const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
  };

  // Fetch dropdown options on mounted
  onMounted(async () => {
      // Fetch categories (rehab_center type only)
      const categoryData = await $fetch('/api/caretaker/category', {
          method: 'GET'
      });
      categories.value = categoryData.data.map(category => ({ value: category.category_id, label: category.name }));
      categories.value.unshift({ value: "", label: "Please choose" });

      // Fetch lookup data for states, countries, and caretaker types
      const lookupData = await $fetch('/api/lookup', {
          method: 'GET'
      });
      states.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
      states.value.unshift({ value: "", label: "Please choose" });

      countries.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
      countries.value.unshift({ value: "", label: "Please choose" });

      caretakerGender.value = lookupData.data.filter(item => item.lookupType === 'gender_type').map(item => ({ value: item.lookupID, label: item.lookupValue }));
      caretakerGender.value.unshift({ value: "", label: "Please choose" });

      caretakerGender.value = lookupData.data.filter(item => item.lookupType === 'nationality_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
      caretakerGender.value.unshift({ value: "", label: "Please choose" });

      caretaker_qualification.value = lookupData.data.filter(item => item.lookupType === 'qualifications_caretaker').map(item => ({ value: item.lookupID, label: item.lookupValue }));
      caretaker_qualification.value.unshift({ value: "", label: "Please choose" });

      caretaker_workinghour.value = lookupData.data.filter(item => item.lookupType === 'qualifications_caretaker').map(item => ({ value: item.lookupID, label: item.lookupValue }));
      caretaker_workinghour.value.unshift({ value: "", label: "Please choose" });
      
      caretakerhealthstatus.value = lookupData.data.filter(item => item.lookupType === 'health_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
      caretakerhealthstatus.value.unshift({ value: "", label: "Please choose" });
      
  });

  // Get details
  const { data: detail } = await useFetch("/api/caretaker/get", {
    method: "GET",
    query: {
      id: parseInt(id),
    },
  });

  // alert(JSON.stringify(detail.value.data));
  if (detail.value.response === 200)
  {
    formData.value.category_code = detail.value.data.user.userCategoryCode;
    formData.value.secret_key = detail.value.data.user.userSecretKey;
    formData.value.userFullName = detail.value.data.user.userFullName;
    formData.value.userEmail = detail.value.data.user.userEmail;
    formData.value.userPhone = detail.value.data.user.userPhone;

    formData.value.caretaker_category = detail.value.data.details.caretaker_category;
    formData.value.caretaker_ic = detail.value.data.details.caretaker_ic;
    formData.value.caretaker_dob = detail.value.data.details.caretaker_dob;
    formData.value.membership = detail.value.data.details.membership_details;
    formData.value.caretaker_nationality = detail.value.data.details.caretaker_nationality;
    formData.value.caretaker_type = detail.value.data.details.caretaker_type;
    formData.value.objective = detail.value.data.details.objectives;
    formData.value.website = detail.value.data.details.website;
    formData.value.profile_picture = detail.value.data.details.caretaker_logo;
    formData.value.operational_areas = detail.value.data.details.operational_area;
    
    formData.value.caretaker_address_line1 = detail.value.data.details.caretaker_address_line1;
    formData.value.caretaker_address_line2 = detail.value.data.details.caretaker_address_line2;
    formData.value.caretaker_address_city = detail.value.data.details.caretaker_address_city;
    formData.value.caretaker_address_postcode = detail.value.data.details.caretaker_address_postcode;
    formData.value.caretaker_address_state = detail.value.data.details.caretaker_address_state;
    formData.value.caretaker_gender = detail.value.data.details.caretaker_gender;
      
    formData.value.contact_number = detail.value.data.details.pic_phoneNum;
    formData.value.email_address = detail.value.data.details.pic_email;
    formData.value.person_in_charge = detail.value.data.details.pic_name;
    formData.value.documents_ic = detail.value.data.details.documents_ic;
    formData.value.documents_certificates = detail.value.data.details.documents_certificates;
  }

  // Form submission handler
  const submitForm = async () => {
      try {

          const { data: add } = await useFetch('/api/caretaker/update', {
              initialCache: false,
              method: 'POST',
              body: JSON.stringify({
                ...formData.value,
                id: useRoute().params.id,
              })
          });

          if (add.value.response === 200) {
              $swal.fire({
                  position: "center",
                  title: "Success",
                  text: 'Caretaker updated successfully!',
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
              });
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
</script>

<template>
  <!-- First Row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
    <nuxt-link :to="`/caretaker/list/emergencycontact/`+id">
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
            <span class="block font-semibold text-xl leading-tight">{{ detail.data.emergencycontactCount }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Emergency contact
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>
    <nuxt-link :to="`/caretaker/list/equipment/`+id">
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
    <nuxt-link :to="`/caretaker/list/donation/`+id">
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
              Total Complete Job
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>
    
  </div>

  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-between items-right mb-6">
      <h2 class="text-xl font-semibold" v-if="!isEditing" >View Caretaker</h2>
      <h2 class="text-xl font-semibold" v-else >Update Caretaker</h2>
    </div>
    <div class="flex flex-col md:flex-row justify-center md:justify-end items-center mb-3 gap-2">
      <nuxt-link :to="`/caretaker/list/emergencycontact/`+id">
        <rs-button variant="info">
            <Icon name="material-symbols:list-alt-outline-rounded" class="mr-2 " /> Emergency contact             
        </rs-button>
      </nuxt-link>
      <nuxt-link :to="`/caretaker/list/equipment/`+id">
          <rs-button variant="success">
              <Icon name="ep:tools" class="mr-2 " /> Equipment             
          </rs-button>
      </nuxt-link>
      <nuxt-link :to="`/caretaker/list/donation/`+id">
          <rs-button variant="warning">
              <Icon name="solar:hand-money-outline" class="mr-2 " /> Job             
          </rs-button>
      </nuxt-link>
      <rs-button variant="primary" @click="toggleEditMode">
        <Icon name="solar:pen-new-square-broken" class="mr-2" /> 
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </rs-button>
    </div>

    <form @submit.prevent="submitForm">
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
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="formData.caretaker_ic" :disabled="!isEditing" required>
          <template #label>
            Identity card Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="date" v-model="formData.caretaker_dob"  :disabled="!isEditing" required>
          <template #label>
            Date of Birth <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.caretaker_gender" :options="caretakerGender" :disabled="!isEditing" required>
          <template #label>
            Gender <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>   

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">        
        <FormKit type="select" v-model="formData.caretaker_nationality" :options="caretakerNationality" :disabled="!isEditing" required>
          <template #label>
            Nationality <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.caretaker_qualification" :options="caretaker_qualification" :disabled="!isEditing" required>
          <template #label>
            Qualification <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.caretaker_workinghour" :options="caretaker_workinghour" :disabled="!isEditing" required>
          <template #label>
            Working hour <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>    

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="text" v-model="formData.caretaker_languages_spoken" :disabled="!isEditing" required>
          <template #label>
            Languages spoken <span class="text-red-500"></span>
          </template>
        </FormKit>       
        <FormKit type="select" v-model="formData.caretaker_healthStatus" :options="caretakerhealthstatus" :disabled="!isEditing" required>
          <template #label>
            Health status <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>        

      <!-- Address Fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="select" v-model="formData.caretaker_gender" :options="countries" :disabled="!isEditing" required>
          <template #label>
            Country <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="formData.caretaker_address_state" :options="states" :disabled="!isEditing" required>
          <template #label>
            State <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.caretaker_address_postcode" :disabled="!isEditing" required>
          <template #label>
            Postcode <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="formData.caretaker_address_line1"  :disabled="!isEditing" required>
          <template #label>
            Address Line 1 <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.caretaker_address_line2" :disabled="!isEditing">
          <template #label>
            Address Line 2
          </template>
        </FormKit>
        <FormKit type="text" v-model="formData.caretaker_address_city" :disabled="!isEditing" required>
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

      <!-- Contact Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Contact Info -->
        <FormKit type="select" v-model="formData.bankName" :disabled="!isEditing" required>
          <template #label>
            Bank Name <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="tel" v-model="formData.acc_number" :disabled="!isEditing" required>
          <template #label>
            Account Bank Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="email" v-model="formData.ben_name" :disabled="!isEditing" required>
          <template #label>
            Beneficiary Name  <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="file" v-model="formData.profile_picture" @change="onChangeFile3" :disabled="!isEditing" required >
          <template #label>
            Profile Picture <span class="text-red-500">*</span>
          </template>
          <template #help>              
            <a :href="apiURL + detail.data.details.caretaker_logo" target="_blank">
                Profile Picture <span class="text-red-500"></span>
            </a>
          </template>
        </FormKit>

        <FormKit type="file" v-model="formData.documents_ic" :disabled="!isEditing" >
          <template #label>
            IC  <span class="text-red-500"></span>
          </template>
          <template #help>              
            <a :href="apiURL + detail.data.details.documents_Licenses" target="_blank">
              IC <span class="text-red-500"></span>
            </a>
          </template>
        </FormKit>
        
        <FormKit type="file" v-model="formData.documents_certificates" :disabled="!isEditing" >
          <template #label>
            Certificates  <span class="text-red-500"></span>
          </template>
          <template #help>              
            <a :href="apiURL + detail.data.details.documents_certificates" target="_blank">
              Certificates <span class="text-red-500"></span>
            </a>
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
