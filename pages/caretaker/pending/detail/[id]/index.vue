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
  // Toggle edit mode

  const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
  };

  const profilRequired = ref('required');
  const icRequired = ref('required');
  const certificateRequired = ref('required');

  // input
  const userFullName = ref('');
  const userEmail = ref('');
  const userPhone = ref('');
  const caretaker_ic = ref('');
  const caretaker_dob = ref('');
  const caretaker_gender = ref('');
  const caretaker_race = ref('');
  const caretaker_religion = ref('');
  const caretaker_marital = ref('');

  const caretaker_nationality = ref('');
  const caretaker_qualification = ref('');
  const caretaker_workinghour = ref('');
  const caretaker_languages_spoken = ref('');
  const caretaker_healthStatus = ref('');
  const caretaker_country = ref('');
  const caretaker_address_state = ref('');
  const caretaker_address_postcode = ref('');
  const caretaker_address_line1 = ref('');
  const caretaker_address_line2 = ref('');
  const caretaker_address_city = ref('');
  const pic_name = ref('');
  const pic_phone = ref('');
  const pic_relationship = ref('');
  const bankName = ref('');
  const acc_number = ref('');
  const ben_name = ref('');
  const profile_picture = ref('');
  const documents_ic = ref('');
  const documents_certificates = ref('');
  
  // Dropdown options
  const states = ref([]);
  const countries = ref([]);
  const caretakerGender = ref([]);
  const caretakerNationality = ref([]);
  const caretakerQualification = ref([]);
  const caretakerworkinghour = ref([]);
  const bankList = ref([]);
  const relationList = ref([]);
  const caretakerhealthstatus = ref([]);
  const caretakerRace = ref([]);
  const caretakerReligion = ref([]);
  const caretakerMarital = ref([]);
  
  const profileImageFile=ref('');
  const profileImageFileName=ref('');
  const icImageFile=ref('');
  const icImageFileName=ref('');
  const certificateImageFile=ref('');
  const certificateImageFileName=ref('');

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

  // Fetch lookup data for states, countries, and caretaker types
  const lookupData = await $fetch('/api/lookup', {
          method: 'GET'
  });

  // alert(JSON.stringify(lookupData));
  if(lookupData.response == 200)
  {
    states.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    states.value.unshift({ value: "", label: "Please choose State" });

    // countries.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    // countries.value.unshift({ value: "", label: "Please choose countries" });

    caretakerGender.value = lookupData.data.filter(item => item.lookupType === 'gender_type').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerGender.value.unshift({ value: "", label: "Please choose gender" });

    caretakerNationality.value = lookupData.data.filter(item => item.lookupType === 'nationality_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerNationality.value.unshift({ value: "", label: "Please choose nationality" });

    caretakerQualification.value = lookupData.data.filter(item => item.lookupType === 'qualifications_caretaker').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerQualification.value.unshift({ value: "", label: "Please choose qualification" });

    caretakerworkinghour.value = lookupData.data.filter(item => item.lookupType === 'working_hours').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerworkinghour.value.unshift({ value: "", label: "Please choose workig hour" });
    
    caretakerhealthstatus.value = lookupData.data.filter(item => item.lookupType === 'health_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerhealthstatus.value.unshift({ value: "", label: "Please choose health status" });
    
    relationList.value = lookupData.data.filter(item => item.lookupType === 'contact_relationship').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    relationList.value.unshift({ value: "", label: "Please choose relationship" });

    bankList.value = lookupData.data.filter(item => item.lookupType === 'bank_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    bankList.value.unshift({ value: "", label: "Please choose bank" });

    caretakerRace.value = lookupData.data.filter(item => item.lookupType === 'race').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerRace.value.unshift({ value: "", label: "Please choose race" });

    caretakerReligion.value = lookupData.data.filter(item => item.lookupType === 'religion').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerReligion.value.unshift({ value: "", label: "Please choose religion" });

    caretakerMarital.value = lookupData.data.filter(item => item.lookupType === 'marital_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    caretakerMarital.value.unshift({ value: "", label: "Please choose marital status" });
  } 

  // Get details
  const { data: detail } = await useFetch("/api/caretaker/get", {
    method: "GET",
    query: {
      id: parseInt(id),
    },
  });

  // alert(JSON.stringify(detail.value));
  if (detail.value.response === 200)
  {
    const user= detail.value.data.user;
    const userCaretaker =detail.value.data.details;

    userFullName.value = detail.value.data.user.userFullName;
    userEmail.value = detail.value.data.user.userEmail;
    userPhone.value = detail.value.data.user.userPhone;

    if(detail.value.data.adminCount > 0)
    {
      profilRequired.value = '';
      icRequired.value = '';
      certificateRequired.value = '';
      caretaker_ic.value = detail.value.data.details.identification_number;
      caretaker_dob.value = formatDate(detail.value.data.details.date_of_birth);
      caretaker_gender.value = detail.value.data.details.gender;
      caretaker_race.value = detail.value.data.details.race;
      caretaker_religion.value = detail.value.data.details.religion;
      caretaker_marital.value = detail.value.data.details.marital_status;
      caretaker_nationality.value = detail.value.data.details.nationality;
      caretaker_qualification.value = detail.value.data.details.qualifications;
      caretaker_workinghour.value = detail.value.data.details.working_hours;
      caretaker_languages_spoken.value = detail.value.data.details.languages_spoken;
      caretaker_healthStatus.value = detail.value.data.details.health_status;

      caretaker_address_state.value = detail.value.data.details.address_state;      
      caretaker_address_postcode.value = detail.value.data.details.address_postcode;
      caretaker_address_line1.value = detail.value.data.details.address_line_1;
      caretaker_address_line2.value = detail.value.data.details.address_line_2;
      caretaker_address_city.value = detail.value.data.details.address_city;

      pic_name.value = detail.value.data.details.emergency_contact_name;
      pic_phone.value = detail.value.data.details.emergency_contact_number;        
      pic_relationship.value = detail.value.data.details.emergency_contact_relationship;

      bankName.value = detail.value.data.details.bank_account_name;
      acc_number.value = detail.value.data.details.bank_account_num;
      ben_name.value = detail.value.data.details.bank_account_beneficiary;
      profile_picture.value = detail.value.data.details.profile_picture;
      documents_ic.value = detail.value.data.details.documents_ic;
      documents_certificates.value = detail.value.data.details.documents_certificate;


    }
    
  }

  const profile_upload=ref('');
  const ic_upload=ref('');
  const certificate_upload=ref('');
  // Form submission handler
  const submitForm = async () => {

    try {      
      // alert(profileImageFileName.value);
      if(profileImageFileName.value != '')
      {
        const { data:uploadImageProfile } = await useFetch("/api/caretaker/upload_profile", {
          method: 'POST',
          body: {
            base64Data: profileImageFile.value,
            fileName: profileImageFileName.value,              
          },
        });

        if(uploadImageProfile.value.respond == 200) 
        {
          profile_upload.value=uploadImageProfile.value.data.filePath;  
          // console.log("profile :" ,uploadImageProfile.value.data.filePath) ;     
          console.log("profile :" ,profile_upload.value) ;     
        }
      }      

      if(icImageFileName.value != '')
      {
        const { data:uploadImageIC } = await useFetch("/api/caretaker/upload_ic", {
          method: 'POST',
          body: {
            base64Data: icImageFile.value,
            fileName: icImageFileName.value,              
          },
        });

        if(uploadImageIC.value.respond == 200) 
        {
          ic_upload.value=uploadImageIC.value.data.filePath;    
          // console.log("ic :" ,uploadImageIC.value.data.filePath) ;     
          console.log("ic :" ,ic_upload.value) ;     

        }
      }
  
      if(certificateImageFileName.value != '')
      {
        const { data:uploadImageCertificate } = await useFetch("/api/caretaker/upload_certificate", {
          method: 'POST',
          body: {
            base64Data: certificateImageFile.value,
            fileName: certificateImageFileName.value,              
          },
        });

        if(uploadImageCertificate.value.respond == 200) 
        {
          certificate_upload.value=uploadImageCertificate.value.data.filePath; 
          // console.log("certificate :" ,uploadImageCertificate.value.data.filePath) ;     
          console.log("certificate :" ,certificate_upload.value) ;    
        }
      }

      const { data: update } = await useFetch('/api/caretaker/update', {
        method: 'POST',
        body: JSON.stringify({
          id: useRoute().params.id,
          userFullName: userFullName.value ,
          userEmail: userEmail.value ,
          userPhone: userPhone.value ,
          caretaker_ic: caretaker_ic.value ,
          caretaker_dob: caretaker_dob.value ,
          caretaker_gender: caretaker_gender.value ,
          caretaker_race: caretaker_race.value ,
          caretaker_religion: caretaker_religion.value ,
          caretaker_marital: caretaker_marital.value ,
          caretaker_nationality: caretaker_nationality.value ,
          caretaker_qualification: caretaker_qualification.value ,
          caretaker_workinghour: caretaker_workinghour.value ,
          caretaker_languages_spoken: caretaker_languages_spoken.value ,
          caretaker_healthStatus: caretaker_healthStatus.value ,
          caretaker_address_state: caretaker_address_state.value ,
          caretaker_address_postcode: caretaker_address_postcode.value ,
          caretaker_address_line1: caretaker_address_line1.value ,
          caretaker_address_line2: caretaker_address_line2.value ,
          caretaker_address_city: caretaker_address_city.value ,
          pic_name: pic_name.value ,
          pic_phone: pic_phone.value ,
          pic_relationship: pic_relationship.value ,
          bankName: bankName.value ,
          acc_number: acc_number.value ,
          ben_name: ben_name.value ,
          profile_picture: profile_upload.value ,
          documents_ic: ic_upload.value ,
          documents_certificates: certificate_upload.value ,
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
          alert("Caretaker failed to create.");
      }

      

      

    } catch (error) {
      
      console.error("Failed to created equipment", error);
      alert("An error occurred while submitting the form.");
    }  
  };

  const showApproveModal = ref(false);
  const confirmApprove = () => {        
      showApproveModal.value = true;
  };
  const closeApprove = () => {        
      showApproveModal.value = false;
  };

  
  const clickApprove = async () => {        
    try {
        const { data:approved} = await useFetch("/api/caretaker/pending/approved", {
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
            $router.push("/caretaker/pending");
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
        const { data:rejected} = await useFetch("/api/caretaker/pending/rejected", {
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
            $router.push("/caretaker/pending");
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
    <div class="flex justify-between items-right mb-6">
      <h2 class="text-xl font-semibold" v-if="!isEditing" >View Caretaker</h2>
      <h2 class="text-xl font-semibold" v-else >Update Caretaker</h2>
    </div>
    <div class="flex flex-col md:flex-row justify-center md:justify-end items-center mb-3 gap-2">
        <nuxt-link :to="`/caretaker/pending`">
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

          <!-- Confirmation Modal -->
      <rs-modal title="Confirm Approved" v-model="showApproveModal" size="md" position="center" >
        <template v-slot:header>
          Confirm Approved
        </template>
        <template v-slot:body>
          Are you sure you want to Approve this caretaker application?
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
          Are you sure you want to Reject this caretaker application?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeReject">Cancel</rs-button>
          <rs-button @click="clickReject">Reject</rs-button>
        </template>
      </rs-modal>
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
        <FormKit type="text" v-model="caretaker_ic" :disabled="!isEditing" required>
          <template #label>
            Identity card Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="date" v-model="caretaker_dob"  :disabled="!isEditing" required>
          <template #label>
            Date of Birth <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="caretaker_gender" :options="caretakerGender" :disabled="!isEditing" required>
          <template #label>
            Gender <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div> 
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="select" v-model="caretaker_race" :options="caretakerRace" :disabled="!isEditing" required>
          <template #label>
            Race <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="caretaker_religion" :options="caretakerReligion" :disabled="!isEditing" required>
          <template #label>
            Religion <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="caretaker_marital" :options="caretakerMarital" :disabled="!isEditing" required>
          <template #label>
            Marital status <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div> 

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">        
        <FormKit type="select" v-model="caretaker_nationality" :options="caretakerNationality" :disabled="!isEditing" required>
          <template #label>
            Nationality <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="caretaker_qualification" :options="caretakerQualification" :disabled="!isEditing" required>
          <template #label>
            Qualification <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="caretaker_workinghour" :options="caretakerworkinghour" :disabled="!isEditing" required>
          <template #label>
            Working hour <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>    

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit type="text" v-model="caretaker_languages_spoken" :disabled="!isEditing" required>
          <template #label>
            Languages spoken <span class="text-red-500">*</span>
          </template>
        </FormKit>       
        <FormKit type="select" v-model="caretaker_healthStatus" :options="caretakerhealthstatus" :disabled="!isEditing" required>
          <template #label>
            Health status <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>        

      <!-- Address Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <FormKit type="select" v-model="caretaker_address_state" :options="states" :disabled="!isEditing" required>
          <template #label>
            State <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="caretaker_address_postcode" :disabled="!isEditing" required>
          <template #label>
            Postcode <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="text" v-model="caretaker_address_line1"  :disabled="!isEditing" required>
          <template #label>
            Address Line 1 <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="caretaker_address_line2" :disabled="!isEditing">
          <template #label>
            Address Line 2
          </template>
        </FormKit>
        <FormKit type="text" v-model="caretaker_address_city" :disabled="!isEditing" required>
          <template #label>
            City <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      <!-- Contact Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Contact Info -->
        <FormKit type="text" v-model="pic_name" :disabled="!isEditing" required>
          <template #label>
            Person in Charge Name <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="tel" v-model="pic_phone" :disabled="!isEditing" required>
          <template #label>
            PIC Contact Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="select" v-model="pic_relationship" :options="relationList" :disabled="!isEditing" required>
          <template #label>
            PIC relationship  <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      <!-- Contact Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Contact Info -->
        <FormKit type="select" v-model="bankName" :options="bankList" :disabled="!isEditing" required>
          <template #label>
            Bank Name <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="tel" v-model="acc_number" :disabled="!isEditing" required>
          <template #label>
            Account Bank Number <span class="text-red-500">*</span>
          </template>
        </FormKit>
        <FormKit type="text" v-model="ben_name" :disabled="!isEditing" required>
          <template #label>
            Beneficiary Name  <span class="text-red-500">*</span>
          </template>
        </FormKit>
      </div>
      
      

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormKit type="file" v-model="profile_picture"  :disabled="!isEditing"  profilRequired>
          <template #label>
            Profile Picture <span  class="text-red-500" v-if="detail.data.adminCount == 0">*</span>
          </template>
          <template #help v-if="detail.data.adminCount > 0">         
            <img :src="apiURL+ detail.data.details.profile_picture" alt="Profile Picture" class="w-32 h-32 object-cover mt-4" />
          </template>
        </FormKit>

        <FormKit type="file" v-model="documents_ic" :disabled="!isEditing"    profilRequired>
          <template #label>
            IC  <span class="text-red-500" v-if="detail.data.adminCount == 0">*</span>
          </template>
          <template #help v-if="detail.data.adminCount > 0">      
            <img :src="apiURL+ detail.data.details.documents_ic" alt="IC" class="w-32 h-32 object-cover mt-4" />
          </template>
        </FormKit>
        
        <FormKit type="file" v-model="documents_certificates" :disabled="!isEditing"  profilRequired>
          <template #label>
            Certificates  <span class="text-red-500" v-if="detail.data.adminCount == 0" >*</span>
          </template>
          <template #help v-if="detail.data.adminCount > 0">     
            <img :src="apiURL+ detail.data.details.documents_certificate" alt="Certificates" class="w-32 h-32 object-cover mt-4" />
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
