<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
    title: "View Rehab Center ",
});

const { $swal, $router } = useNuxtApp();

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
    documents_certificates: null,
    center_description: '',
    geolocation: ''
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
  formData.value.userFullName = detail.value.data.user.userFullName;
  formData.value.userEmail = detail.value.data.user.userEmail;
  formData.value.userPhone = detail.value.data.user.userPhone;
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
  formData.value.document_licenses = detail.value.data.details.document_Licenses;
  formData.value.documents_certificates = detail.value.data.details.documents_certificates;
  formData.value.center_description = detail.value.data.details.center_description;
  formData.value.geolocation = detail.value.data.details.geolocation;
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
        <h2 class="text-xl font-semibold" v-if="!isEditing" >View Rehab Center</h2>
        <h2 class="text-xl font-semibold" v-else >Update Rehab Center</h2>

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
      <form >
        <!-- Center Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="select" v-model="formData.center_category" :options="categories" :disabled="!isEditing" required>
            <template #label>
              Center Category <span class="text-red-500">*</span>
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="file" v-model="formData.document_licenses" :disabled="!isEditing" >
            <template #label>
              License Documents <span class="text-red-500"></span>
            </template>
          </FormKit>
          <FormKit type="file" v-model="formData.documents_certificates" :disabled="!isEditing" >
            <template #label>
              Certificates <span class="text-red-500"></span>
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
