<script setup>
  import { ref, onMounted } from 'vue';

  definePageMeta({
      title: "View Admin ",
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

  const modalEdit = ref(false);
const selectedAdmin = ref(null);
const inputName = ref('');
const inputEmail = ref('');
const inputContact = ref('');
const inputDOB = ref('');
const inputGender = ref('');
const inputLine1 = ref('');
const inputLine2 = ref('');
const inputCity = ref('');
const inputPostcode = ref('');
const inputState = ref('');
const inputCountry = ref('');
const genders = ref([]);
const admins = ref(null);
const states = ref([]);
const countries = ref([]);


const errorName = ref('');
const errorEmail = ref('');
const errorContact = ref('');
const errorDOB = ref('');
const errorGender = ref('');
const errorLine1 = ref('');
const errorLine2 = ref('');
const errorCity = ref('');
const errorPostcode = ref('');
const errorState = ref('');
const errorCountry = ref('');
const formatDate = (isoString) => {
  const date = new Date(isoString);
  
  // Extract day, month, year, hours, minutes, and seconds
  const day = String(date.getDate()).padStart(2, "0");      // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month (months are 0-indexed)
  const year = date.getFullYear();                           // Full year

  // Return the formatted string
  return `${year}-${month}-${day}`;
};
try {
    const { data: detail } = await useFetch("/api/admin/get", {
        method: "GET",
        query: {
            id: parseInt(id),
        },
    });
    // alert(JSON.stringify(detail.value));
    if (detail.value.response === 200) 
    {
        selectedAdmin.value=id;
        inputName.value = detail.value.data.user.userFullName ;
        inputEmail.value = detail.value.data.user.userEmail;
        inputContact.value = detail.value.data.user.userPhone  ;
        if(detail.value.data.details !=null)
        {
          inputDOB.value = formatDate(detail.value.data.details.admin_date_of_birth) ;
          inputGender.value = detail.value.data.details.admin_gender;
          inputLine1.value = detail.value.data.details.admin_address_line1;
          inputLine2.value = detail.value.data.details.admin_address_line2;
          inputCity.value = detail.value.data.details.admin_address_city;
          inputPostcode.value = detail.value.data.details.admin_address_postcode;
          inputState.value = detail.value.data.details.admin_address_state;
          inputCountry.value = detail.value.data.details.admin_address_country;
        }
        
        modalEdit.value = true;
    } 
    else 
    {
        alert("Admin not found.");
    }
} 
catch (error) 
{
    console.error("Failed to fetch admin details:", error);
    alert("An error occurred while fetching admin details. Please try again.");
}



const closeEdit= () =>{
  modalEdit.value = false;
};   

const submitAdmin = async () => {
  try {

    const { data: update } = await useFetch("/api/admin/update", {
        method: "POST",
        body: JSON.stringify({                  
            id: selectedAdmin.value,
            userFullName: inputName.value ,
            userEmail: inputEmail.value ,
            userPhone: inputContact.value ,
            admin_date_of_birth: inputDOB.value ,
            admin_gender: inputGender.value ,
            admin_address_line1: inputLine1.value ,
            admin_address_line2: inputLine2.value ,
            admin_address_city: inputCity.value ,
            admin_address_postcode: inputPostcode.value ,
            admin_address_state: inputState.value ,
            admin_address_country: inputCountry.value 
        }),
    });        

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
        alert("Admin failed to update.");
    }
  } 
  catch (error) 
  {
      console.error("Failed to updated admin details:", error);
      alert("An error occurred while updated admin details. Please try again.");
  }
};

const lookupData = await $fetch('/api/lookup', {
    method: 'GET'
});
states.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
states.value.unshift({ value: "", label: "Please choose" });

countries.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
countries.value.unshift({ value: "", label: "Please choose" });

genders.value = lookupData.data.filter(item => item.lookupType === 'gender_type').map(item => ({ value: item.lookupID, label: item.lookupValue }));
genders.value.unshift({ value: "", label: "Please choose" });
</script>

<template>
  
  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-between items-right mb-6">
      <h2 class="text-xl font-semibold" v-if="!isEditing" >View Admin</h2>
      <h2 class="text-xl font-semibold" v-else >Update Admin</h2>
    </div>
    <div class="flex flex-col md:flex-row justify-center md:justify-end items-center mb-3 gap-2">
      <rs-button variant="primary" @click="toggleEditMode">
        <Icon name="solar:pen-new-square-broken" class="mr-2" /> 
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </rs-button>
    </div>

    <form @submit.prevent="submitAdmin">
      <div class="mb-4">
          <FormKit type="text" label="Name *" v-model="inputName" :class="{'border-red-500': errorName}" placeholder="Full Name"  :disabled="!isEditing"  required />
          <p v-if="errorName" class="text-red-500 text-sm">{{ errorName }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
              <FormKit type="email" label="Email *" v-model="inputEmail" :class="{'border-red-500': errorEmail}" placeholder="example@example.com" :disabled="!isEditing" readonly required />
              <p v-if="errorEmail" class="text-red-500 text-sm">{{ errorEmail }}</p>
          </div>
          <div class="mb-4">
              <FormKit type="text" label="Phone Num *" v-model="inputContact" :class="{'border-red-500': errorContact}" placeholder="0123654789" :disabled="!isEditing"  maxlength="11" required />
              <p v-if="errorContact" class="text-red-500 text-sm">{{ errorContact }}</p>
          </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
              <FormKit type="select" label="Gender *" v-model="inputGender" :options="genders" :class="{'border-red-500': errorGender}" :disabled="!isEditing" required />
              <p v-if="errorGender" class="text-red-500 text-sm">{{ errorGender }}</p>
          </div>
          <div class="mb-4">
              <FormKit type="date" label="Date of birth *" v-model="inputDOB" :class="{'border-red-500': errorDOB}" placeholder="Date of Birth" :disabled="!isEditing" required />
              <p v-if="errorDOB" class="text-red-500 text-sm">{{ errorDOB }}</p>
          </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
              <FormKit type="text" label="Line 1 *" v-model="inputLine1" :class="{'border-red-500': errorLine1}" placeholder="Line 1" :disabled="!isEditing" required />
              <p v-if="errorLine1" class="text-red-500 text-sm">{{ errorLine1 }}</p>
          </div>
          <div class="mb-4">
              <FormKit type="text" label="Line 2" v-model="inputLine2" :class="{'border-red-500': errorLine2}" placeholder="Line 2" :disabled="!isEditing"  />
              <p v-if="errorLine2" class="text-red-500 text-sm">{{ errorLine2 }}</p>
          </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
              <FormKit type="text" label="Postcode *" v-model="inputPostcode" :class="{'border-red-500': errorPostcode}" placeholder="Postcode" :disabled="!isEditing"  maxlength="5" required  />
              <p v-if="errorPostcode" class="text-red-500 text-sm">{{ errorPostcode }}</p>
          </div>
          <div class="mb-4">
              <FormKit type="text" label="City *" v-model="inputCity" :class="{'border-red-500': errorCity}" placeholder="City" :disabled="!isEditing" required />
              <p v-if="errorCity" class="text-red-500 text-sm">{{ errorCity }}</p>
          </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
              <FormKit type="select" label="country *" v-model="inputCountry" :options="countries" :class="{'border-red-500': errorCountry}" :disabled="!isEditing" required/>
              <p v-if="errorCountry" class="text-red-500 text-sm">{{ errorCountry }}</p>
          </div>
          <div class="mb-4">
              <FormKit type="select" label="State *" v-model="inputState" :options="states" :class="{'border-red-500': errorState}" :disabled="!isEditing" required />
              <p v-if="errorState" class="text-red-500 text-sm">{{ errorState }}</p>
          </div>
      </div>   
      <div v-if="isEditing" class="md:col-span-2 mt-6">
        <rs-button variant="primary" type="submit">Save Changes</rs-button>
      </div>               
    </form>     
  </div>
</template>

<style scoped>
  /* Additional styling can be applied here */
</style>
