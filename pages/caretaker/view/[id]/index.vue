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

  const onChangeFile = async (event) => {      
    const file = event.target.files[0];  // Get the first file from the input
    const fileType = file.type;
    try {
      const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
      const base64Data = await ToBase64OpsImage(compressedImage);

      profileImageFile.value = base64Data;  // Store the file in your form data
      profileImageFileName.value = file.name;
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

      icImageFile.value = base64Data2;  // Store the file in your form data
      icImageFileName.value = file2.name;
      
    } catch (error) {
      $swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "An error occurred while processing the file.",
      });
    } 
  };

  const onChangeFile3 = async (event) => {      
    const file3 = event.target.files[0];  // Get the first file from the input
    const fileType3 = file3.type;
    try {
      const compressedImage3 = await resizeAndCompressImage(file3, 800, 600, 0.7);
      const base64Data3 = await ToBase64OpsImage(compressedImage3);

      certificateImageFile.value = base64Data3;  // Store the file in your form data
      certificateImageFileName.value = file3.name;
      
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
</script>

<template>
  <!-- First Row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-6">
   
    <nuxt-link :to="`/caretaker/equipment/`+id">
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
    <nuxt-link :to="`/caretaker/job/`+id">
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
            <span class="block font-semibold text-xl leading-tight">{{ detail.data.jobs.length }}</span>
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
      <!-- <nuxt-link :to="`/caretaker/contact/`+id">
        <rs-button variant="info">
            <Icon name="material-symbols:list-alt-outline-rounded" class="mr-2 " /> Emergency contact             
        </rs-button>
      </nuxt-link> -->
      <nuxt-link :to="`/caretaker/equipment/`+id">
          <rs-button variant="success">
              <Icon name="ep:tools" class="mr-2 " /> Equipment             
          </rs-button>
      </nuxt-link>
      <nuxt-link :to="`/caretaker/job/`+id">
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
        <FormKit type="file" v-model="profile_picture" @change="onChangeFile" :disabled="!isEditing"  profilRequired>
          <template #label>
            Profile Picture <span  class="text-red-500" v-if="detail.data.adminCount == 0">*</span>
          </template>
          <template #help v-if="detail.data.adminCount > 0">              
            <a :href="apiURL + detail.data.details.profile_picture" target="_blank">
                Profile Picture <span class="text-red-500"></span>
            </a>
          </template>
        </FormKit>

        <FormKit type="file" v-model="documents_ic" :disabled="!isEditing"   @change="onChangeFile2" profilRequired>
          <template #label>
            IC  <span class="text-red-500" v-if="detail.data.adminCount == 0">*</span>
          </template>
          <template #help v-if="detail.data.adminCount > 0">              
            <a :href="apiURL + detail.data.details.documents_ic" target="_blank">
              IC <span class="text-red-500"></span>
            </a>
          </template>
        </FormKit>
        
        <FormKit type="file" v-model="documents_certificates" :disabled="!isEditing"  @change="onChangeFile3" profilRequired>
          <template #label>
            Certificates  <span class="text-red-500" v-if="detail.data.adminCount == 0" >*</span>
          </template>
          <template #help v-if="detail.data.adminCount > 0">              
            <a :href="apiURL + detail.data.details.documents_certificate" target="_blank">
              Certificates <span class="text-red-500"></span>
            </a>
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
