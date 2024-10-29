<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
    title: "View Association ",
});

const { $swal, $router } = useNuxtApp();

// Editing mode toggle
const isEditing = ref(false);
const id = useRoute().params.id;
const formatDate = (isoString) => {
  const date = new Date(isoString);
  
  // Extract day, month, year, hours, minutes, and seconds
  const day = String(date.getDate()).padStart(2, "0");      // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month (months are 0-indexed)
  const year = date.getFullYear();                           // Full year

  // Return the formatted string
  return `${year}-${month}-${day}`;
};
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

  const showApproveModal = ref(false);
  const confirmApprove = () => {        
      showApproveModal.value = true;
  };
  const closeApprove = () => {        
      showApproveModal.value = false;
  };

  const clickApprove = async () => {        
    try {
        const { data:approved} = await useFetch("/api/association/pending/approved", {
            method: "POST",
            body: JSON.stringify({                  
              id: id,
            }),
        });        

        if (approved.value.response === 200) 
        {
          showApproveModal.value = false;
          $swal.fire({
            position: "center",
            title: "Success",
            text: approved.value.message,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          setTimeout(() => {
            $router.push("/association/pending");
          }, 1000);
        } 
        else 
        {
            alert("User failed to approved.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to approved user details:", error);
          alert("An error occurred while approved user details. Please try again.");
      }
  };

  const showRejectModal = ref(false);
  const confirmReject = () => {        
    showRejectModal.value = true;
  };
  const closeReject = () => {        
    showRejectModal.value = false;
  };
  const clickReject = async () => {        
    try {
        const { data:rejected} = await useFetch("/api/association/pending/rejected", {
            method: "POST",
            body: JSON.stringify({                  
              id: id,
            }),
        });        

        if (rejected.value.response === 200) 
        {
          showRejectModal.value = false;
          $swal.fire({
            position: "center",
            title: "Success",
            text: rejected.value.message,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          setTimeout(() => {
            $router.push("/association/pending");
          }, 1000);
        } 
        else 
        {
            alert("User failed to reject.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to reject user:", error);
          alert("An error occurred while reject user. Please try again.");
      }
  };
  
</script>

<template>
    <div class="bg-white p-8 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold" v-if="!isEditing" >View Association</h2>
        <h2 class="text-xl font-semibold" v-else >Update Association</h2>

        <!-- <rs-button variant="primary" @click="toggleEditMode">
          <Icon name="solar:pen-new-square-broken" class="mr-2" /> 
          {{ isEditing ? 'Cancel' : 'Edit' }}
        </rs-button> -->
        <div class="flex items-center gap-1">
          <nuxt-link :to="`/association/pending`">
            <rs-button >
              <Icon
                name="fa6-solid:reply"
                class="mr-2 !w-4 !h-4"
              />
              Back
            </rs-button>
          </nuxt-link>
          
          <rs-button @click="confirmApprove" >
            <Icon
              name="material-symbols:check-box"
              class="mr-2 !w-4 !h-4"
            />
            Approved
          </rs-button>
          
          <rs-button variant="danger" @click="confirmReject">
            <Icon
              name="gridicons:cross"
              class="mr-2 !w-4 !h-4"
            />
            Reject
          </rs-button>
        </div>
      </div>
      
      <!-- Confirmation Modal -->
      <rs-modal title="Confirm Approved" v-model="showApproveModal" size="md" position="center" >
        <template v-slot:header>
          Confirm Approved
        </template>
        <template v-slot:body>
          Are you sure you want to Approve this rehab center application?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeApprove">Cancel</rs-button>
          <rs-button @click="clickApprove">Approve</rs-button>
        </template>
      </rs-modal>

      <!-- Confirmation Modal -->
      <rs-modal title="Confirm Reject" v-model="showRejectModal" size="md" position="center" >
        <template v-slot:header>
          Confirm Reject
        </template>
        <template v-slot:body>
          Are you sure you want to Reject this rehab center application?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeReject">Cancel</rs-button>
          <rs-button @click="clickReject">Reject</rs-button>
        </template>
      </rs-modal>
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
        <FormKit type="file" v-model="formData.document_logoEdit"  :disabled="!isEditing" >
          <template #label>
            Logo <span class="text-red-500">*</span>
          </template>
          <template #help v-if="detail.data.details != null">              
            <a :href="apiURL + detail.data.details.association_logo" target="_blank">
              Logo <span class="text-red-500"></span>
            </a>
          </template>
        </FormKit>

        <FormKit type="file" v-model="formData.document_licensesEdit" :disabled="!isEditing"  >
          <template #label >
            License Documents  <span class="text-red-500"></span>
          </template>
          <template #help v-if="detail.data.details != null">              
            <a :href="apiURL + detail.data.details.documents_Licenses" target="_blank">
              License Documents <span class="text-red-500"></span>
            </a>
          </template>
        </FormKit>
        
        <FormKit type="file" v-model="formData.documents_certificatesEdit" :disabled="!isEditing" >
          <template #label>
            Certificates  <span class="text-red-500"></span>
          </template>
          <template #help v-if="detail.data.details != null ">              
            <a :href="apiURL + detail.data.details.documents_certificates" target="_blank">
              Certificates Documents <span class="text-red-500"></span>
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
