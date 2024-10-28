<script setup>
  import { ref, onMounted } from 'vue';

  definePageMeta({
      title: "View Customer ",
  });

  const { $swal, $router } = useNuxtApp();
  const config = useRuntimeConfig();
  const apiURL = config.public.uploadURL;
  // Editing mode toggle
  const isEditing = ref(false);
  const id = useRoute().params.id;
  // Toggle edit mode

  const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
  };

  // input
  const userFullName = ref('');
  const userEmail = ref('');
  const userPhone = ref('');

  const customer_ic = ref('');
  const customer_dob = ref('');
  const customer_gender = ref('');
  const customer_race=ref('');
  const customer_religion=ref('');
  const customer_marital=ref('');
  const customer_occupation=ref('');
  
  const customer_address_country = ref('');
  const customer_address_state = ref('');
  const customer_address_postcode = ref('');
  const customer_address_line1 = ref('');
  const customer_address_line2 = ref('');
  const customer_address_city = ref('');
  const medicalcondition=ref('');
  const medications=ref('');
  const occupation=ref('');


  // Dropdown options
  const states = ref([]); 
  const countries = ref([]);
  const customerGender = ref([]);
  const customerRace = ref([]);
  const customerReligion = ref([]);
  const customerMarital = ref([]);
 


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

  // Fetch lookup data for states, countries, and customer types
  const lookupData = await $fetch('/api/lookup', {
          method: 'GET'
  });

  // alert(JSON.stringify(lookupData));
  if(lookupData.response == 200)
  {
    states.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    states.value.unshift({ value: "", label: "Please choose State" });

    countries.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    countries.value.unshift({ value: "", label: "Please choose countries" });

    customerGender.value = lookupData.data.filter(item => item.lookupType === 'gender_type').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    customerGender.value.unshift({ value: "", label: "Please choose gender" });

    customerRace.value = lookupData.data.filter(item => item.lookupType === 'race').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    customerRace.value.unshift({ value: "", label: "Please choose race" });

    customerReligion.value = lookupData.data.filter(item => item.lookupType === 'religion').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    customerReligion.value.unshift({ value: "", label: "Please choose religion" });

    customerMarital.value = lookupData.data.filter(item => item.lookupType === 'marital_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    customerMarital.value.unshift({ value: "", label: "Please choose marital status" });

  } 

  // Get details
  const { data: detail } = await useFetch("/api/customer/get", {
    method: "GET",
    query: {
      id: parseInt(id),
    },
  });

  // alert(JSON.stringify(detail.value.data));
  if (detail.value.response === 200)
  {    
    userFullName.value = detail.value.data.user.userFullName;
    userEmail.value = detail.value.data.user.userEmail;
    userPhone.value = detail.value.data.user.userPhone;

    if(detail.value.data.adminCount > 0)
    {     
      customer_ic.value = detail.value.data.details.identification_number;
      customer_dob.value = formatDate(detail.value.data.details.dateOfBirth);
      customer_gender.value = detail.value.data.details.gender;
      customer_race.value = detail.value.data.details.race;
      customer_religion.value = detail.value.data.details.religion;
      customer_marital.value = detail.value.data.details.marital_status;
      customer_occupation.value = detail.value.data.details.accupation;
     
      customer_address_state.value = detail.value.data.details.state;      
      customer_address_postcode.value = detail.value.data.details.postcode;
      customer_address_line1.value = detail.value.data.details.addressLine1;
      customer_address_line2.value = detail.value.data.details.addressLine2;
      customer_address_city.value = detail.value.data.details.city;

      medicalcondition.value = detail.value.data.details.medicalConditions;
      medications.value = detail.value.data.details.medications;        
     
    }    
  }

  const submitForm = async () => {
    try {    
      const { data: update } = await useFetch('/api/customer/update', {
        method: 'POST',
        body: JSON.stringify({
          id: useRoute().params.id,
          userFullName: userFullName.value ,
          userEmail: userEmail.value ,
          userPhone: userPhone.value ,

          customer_ic: customer_ic.value ,
          customer_dob: customer_dob.value ,
          customer_gender: customer_gender.value ,
          customer_race: customer_race.value ,
          customer_religion: customer_religion.value ,
          customer_marital: customer_marital.value ,
          customer_occupation: customer_occupation.value ,
          customer_address_country: customer_address_country.value ,
          customer_address_state: customer_address_state.value ,
          customer_address_postcode: customer_address_postcode.value ,
          customer_address_line1: customer_address_line1.value ,
          customer_address_line2: customer_address_line2.value ,
          customer_address_city: customer_address_city.value ,
          medicalcondition: medicalcondition.value ,
          medications: medications.value 
        })
      });

      // alert(JSON.stringify(update.value));

      if (update.value.response === 200) 
      {
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
          alert("Customer failed to create.");
      }

      

      

    } catch (error) {
      
      console.error("Failed to created equipment", error);
      alert("An error occurred while submitting the form.");
    }  
  };
</script>

<template>
  <!-- First Row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
    <nuxt-link :to="`/customer/contact/`+id">
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
            <span class="block font-semibold text-xl leading-tight">{{ detail.data.emergencyCount }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Emergency contact
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>
    <nuxt-link :to="`/customer/equipment/`+id">
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
    <nuxt-link :to="`/customer/job/`+id">
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
            <span class="block font-semibold text-xl leading-tight">{{ detail.data.donationSum }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Job Created
            </span>
          </div>
        </div>
      </rs-card>
    </nuxt-link>
    
  </div>

  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-between items-right mb-6">
      <h2 class="text-xl font-semibold" v-if="!isEditing" >View Customer</h2>
      <h2 class="text-xl font-semibold" v-else >Update Customer</h2>
    </div>
    <div class="flex flex-col md:flex-row justify-center md:justify-end items-center mb-3 gap-2">
      <nuxt-link :to="`/customer/contact/`+id">
        <rs-button variant="info">
            <Icon name="material-symbols:list-alt-outline-rounded" class="mr-2 " /> Emergency contact             
        </rs-button>
      </nuxt-link>
      <nuxt-link :to="`/customer/equipment/`+id">
          <rs-button variant="success">
              <Icon name="ep:tools" class="mr-2 " /> Equipment             
          </rs-button>
      </nuxt-link>
      <nuxt-link :to="`/customer/job/`+id">
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
        <FormKit type="text" v-model="userFullName" :disabled="!isEditing"  required>
          <template #label>
            Full Name <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="email" v-model="userEmail"  disabled >
          <template #label>
            Email <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="tel" v-model="userPhone" :disabled="!isEditing" required>
          <template #label>
            Phone <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="customer_ic" :disabled="!isEditing" required>
          <template #label>
            Identity card Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="date" v-model="customer_dob"  :disabled="!isEditing" required>
          <template #label>
            Date of Birth <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="customer_gender" :options="customerGender" :disabled="!isEditing" required>
          <template #label>
            Gender <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>  

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="select" v-model="customer_race" :options="customerRace" :disabled="!isEditing" required>
          <template #label>
            Race <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="customer_religion" :options="customerReligion" :disabled="!isEditing" required>
          <template #label>
            Religion <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="customer_marital" :options="customerMarital" :disabled="!isEditing" required>
          <template #label>
            Marital status <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div> 

      <!-- Address Fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="select" v-model="customer_address_country" :options="countries" :disabled="!isEditing" required>
          <template #label>
            Country <span class="text-red-500">*</span>
          </template>
        </FormKit>

        <FormKit type="select" v-model="customer_address_state" :options="states" :disabled="!isEditing" required>
          <template #label>
            State <span class="text-red-500">*</span>
          </template>
        </FormKit>

        <FormKit type="text" v-model="customer_address_postcode" :disabled="!isEditing" required>
          <template #label>
            Postcode <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="customer_address_line1"  :disabled="!isEditing" required>
          <template #label>
            Address Line 1 <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="customer_address_line2" :disabled="!isEditing">
          <template #label>
            Address Line 2
          </template>
        </FormKit>
        <FormKit type="text" v-model="customer_address_city" :disabled="!isEditing" required>
          <template #label>
            City <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      <!-- Contact Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="occupation" :disabled="!isEditing" required>
          <template #label>
            Occupation <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="textarea" v-model="medicalcondition" :disabled="!isEditing" required>
          <template #label>
           Medical condition <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="textarea" v-model="medications" :disabled="!isEditing" required>
          <template #label>
            Medications<span class="text-red-500">*</span>
          </template>
        </FormKit>        
      </div>
      
      
      <!-- Submit Button (only show if editing) -->
      <div v-if="isEditing" class="md:col-span-2 mt-6">
        <rs-button variant="primary" type="submit" >Save Changes</rs-button>
      </div>
    </form>
  </div>
</template>

<style scoped>
  /* Additional styling can be applied here */
</style>
