<script setup>
  definePageMeta({
    title: "Register",
    layout: "empty",
    middleware: ["dashboard"],
  });
  const { $swal, $router } = useNuxtApp();

  const passwordVisible = ref(false);
  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };

  const roleOption = ref("Association");
  const roleID = ref(4);
  const inputEmail =ref('');
  const inputPassword =ref('');
  const inputFullname =ref('');
  const inputPhone =ref('');
  const inputRegistrationNum =ref('');
  const inputLicenseNum =ref('');
  const inputWebsite =ref('');
  const inputAddressLine1 =ref('');
  const inputAddressLine2 =ref('');
  const inputCity =ref('');
  const inputPostcode =ref('');
  const inputState =ref('');
  const inputCountry =ref('');
  const inputPICName =ref('');
  const inputPICContact =ref('');
  const inputPICemail =ref('');
  const inputLogo =ref('');
  const inputLicense =ref('');
  const inputCertificate =ref('');
  const inputLogo1 =ref('');
  const inputLicense1 =ref('');
  const inputCertificate1 =ref('');


  const inputAssociationSecretKey =ref('');
  const inputAssociationCategoryCode =ref('');
  const inputAssociationCategory =ref('');
  const inputAssociationType =ref('');
  const inputAssociationObjective =ref('');
  const inputAssociationMembership =ref('');
  const inputAssociationEsablishDate =ref('');
  const inputAssociationOperationAreas =ref('');

  const inputRehabCategory =ref('');
  const inputRehabType =ref('');
  const inputRehabDescription =ref('');
  const inputRehabGeolocation =ref('');
  const inputRehabCapacity =ref('');
  const inputRehabOperationHour =ref('');

  const optionRehabCategory=ref([]);
  const optionRehabType=ref([]);
  const optionAssociationCategory=ref([]);
  const optionAssociationType=ref([]);
  const optionCountries=ref([]);
  const optionStates=ref([]);

  const licensesFile =ref('');
  const licensesFileName =ref('');
  const certificatesFile =ref('');
  const certificatesFileName =ref('');
  const logoFile =ref('');
  const logoFileName =ref('');

  const associationRequired=ref('');
  const rehabRequired=ref('');

  

  const rehabCategoryData = await $fetch('/api/rehab-center/category', {method: 'GET'});
  optionRehabCategory.value = rehabCategoryData.data.map(category => ({ value: category.category_id, label: category.name }));
  optionRehabCategory.value.unshift({ value: "", label: "Please choose" });

  const associationCategoryData = await $fetch('/api/association/category', {method: 'GET'});
  optionAssociationCategory.value = associationCategoryData.data.map(category => ({ value: category.category_id, label: category.name }));
  optionAssociationCategory.value.unshift({ value: "", label: "Please choose" });

  const lookupDatas = await $fetch('/api/lookup', {method: 'GET'});
  optionStates.value = lookupDatas.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
  optionStates.value.unshift({ value: "", label: "Please choose" });

  optionCountries.value = lookupDatas.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
  optionCountries.value.unshift({ value: "", label: "Please choose" });

  optionRehabType.value = lookupDatas.data.filter(item => item.lookupType === 'associationType_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
  optionRehabType.value.unshift({ value: "", label: "Please choose" });
  optionAssociationType.value = lookupDatas.data.filter(item => item.lookupType === 'associationType_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
  optionAssociationType.value.unshift({ value: "", label: "Please choose" });

  // Watch roleOption and update formData.roleID accordingly
  watch(roleOption, (newVal) => {
    roleID.value = newVal === "Association" ? 4 : 3;
  });

  const onChangeFile = async (event) => {      
    const file = event.target.files[0];  // Get the first file from the input
    const fileType = file.type;
    try {
      if (fileType.startsWith('image/')) {
        const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
        const base64Data = await ToBase64OpsImage(compressedImage);

        licensesFile.value = base64Data;  // Store the file in your form data
        licensesFileName.value = file.name;
      }
      else if (fileType === 'application/pdf') {
        const base64Data = await ToBase64OpsImage(file);

        licensesFile.value = base64Data;  // Store the file in your form data
        licensesFileName.value = file.name;
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
  
  const onChangeFile2 = async (event) => {      
    const file = event.target.files[0];  // Get the first file from the input
    const fileType = file.type;
    try {
      
      if (fileType.startsWith('image/')) {
        const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
        const base64Data = await ToBase64OpsImage(compressedImage);
        
        certificatesFile.value = base64Data;  // Store the file in your form data
        certificatesFileName.value = file.name; 
      }
      else if (fileType === 'application/pdf') {
        const base64Data = await ToBase64OpsImage(file);

        certificatesFile.value = base64Data;  // Store the file in your form data
        certificatesFileName.value = file.name; 
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

  const onChangeFile3 = async (event) => {      
    const file = event.target.files[0];  // Get the first file from the input
    const fileType = file.type;
    try {
      
      if (fileType.startsWith('image/')) {
        const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
        const base64Data3 = await ToBase64OpsImage(compressedImage);
        
        logoFile.value = base64Data3;  // Store the file in your form data
        logoFileName.value = file.name; 
      }
      else if (fileType === 'application/pdf') {
        const base64Data3 = await ToBase64OpsImage(file);

        logoFile.value = base64Data3;  // Store the file in your form data
        logoFileName.value = file.name;
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


  // Function to handle form submission
  const handleSubmit = async () => {
  
    try {
      const { data:checkusername } = await useFetch("/api/checkusername", {
        method: 'POST',
        body: {
          userUsername: inputEmail.value,    
        },
      });
      if(checkusername.value.response === 409)
      {
        $swal.fire({
            icon: "error",
            title: "Error",
            text: 'Username already exists.',
        });
      }
      else
      {
        if(roleID.value == 3)//rehab
        {
          const { data:uploadImageLicenses } = await useFetch("/api/rehab-center/upload", {
            method: 'POST',
            body: {
              base64Data: licensesFile.value,
              fileName: licensesFileName.value,              
            },
          });

          if(uploadImageLicenses.value.respond == 200) 
          {
            inputLicense.value = uploadImageLicenses.value.data.filePath;
          }

          const { data:uploadImageCertificates } = await useFetch("/api/rehab-center/upload", {
            method: 'POST',
            body: {
              base64Data: certificatesFile.value,
              fileName: certificatesFileName.value,              
            },
          });

          if(uploadImageCertificates.value.respond == 200) 
          {
            inputCertificate.value = uploadImageCertificates.value.data.filePath;
          }

          const { data:uploadImageLogo} = await useFetch("/api/rehab-center/upload", {
            method: 'POST',
            body: {
              base64Data: logoFile.value,
              fileName: logoFileName.value,              
            },
          });

          if(uploadImageLogo.value.respond == 200) 
          {
            inputLogo.value = uploadImageLogo.value.data.filePath;
          }
        }
        else
        {
          const { data:uploadImageLicenses } = await useFetch("/api/association/upload", {
            method: 'POST',
            body: {
              base64Data: licensesFile.value,
              fileName: licensesFileName.value,              
            },
          });

          if(uploadImageLicenses.value.respond == 200) 
          {
            inputLicense.value = uploadImageLicenses.value.data.filePath;
          }

          const { data:uploadImageCertificates } = await useFetch("/api/association/upload", {
            method: 'POST',
            body: {
              base64Data: certificatesFile.value,
              fileName: certificatesFileName.value,              
            },
          });

          if(uploadImageCertificates.value.respond == 200) 
          {
            inputCertificate.value = uploadImageCertificates.value.data.filePath;
          }

          const { data:uploadImageLogo} = await useFetch("/api/association/upload", {
            method: 'POST',
            body: {
              base64Data: logoFile.value,
              fileName: logoFileName.value,              
            },
          });

          if(uploadImageLogo.value.respond == 200) 
          {
            inputLogo.value = uploadImageLogo.value.data.filePath;
          }
        }

        const { data: add } = await useFetch('/api/register/create', {
          method: 'POST',
          body: JSON.stringify({
            roleID : roleID.value,
            inputEmail : inputEmail.value,
            inputPassword : inputPassword.value,
            inputFullname : inputFullname.value,
            inputPhone : inputPhone.value,
            inputRegistrationNum : inputRegistrationNum.value,
            inputLicenseNum : inputLicenseNum.value,
            inputWebsite : inputWebsite.value,
            inputAddressLine1 : inputAddressLine1.value,
            inputAddressLine2 : inputAddressLine2.value,
            inputCity : inputCity.value,
            inputPostcode : inputPostcode.value,
            inputState : inputState.value,
            inputCountry : inputCountry.value,
            inputPICName : inputPICName.value,
            inputPICContact : inputPICContact.value,
            inputPICemail : inputPICemail.value,
            inputLogo : inputLogo.value,
            inputLicense : inputLicense.value,
            inputCertificate : inputCertificate.value,

            inputAssociationSecretKey : inputAssociationSecretKey.value,
            inputAssociationCategoryCode : inputAssociationCategoryCode.value,
            inputAssociationCategory : inputAssociationCategory.value,
            inputAssociationType : inputAssociationType.value,
            inputAssociationObjective : inputAssociationObjective.value,
            inputAssociationMembership : inputAssociationMembership.value,
            inputAssociationEsablishDate : inputAssociationEsablishDate.value,
            inputAssociationOperationAreas : inputAssociationOperationAreas.value,

            inputRehabCategory : inputRehabCategory.value,
            inputRehabType : inputRehabType.value,
            inputRehabDescription : inputRehabDescription.value,
            inputRehabGeolocation : inputRehabGeolocation.value,
            inputRehabCapacity : inputRehabCapacity.value,
            inputRehabOperationHour : inputRehabOperationHour.value,
          })
        });

        // alert(JSON.stringify(add.value));
        if(add.value.response == 200)
        {
           $swal.fire({
            position: "center",
            icon: "success",
            title: "Registration Successful",
            text: "You will be redirected to the login page shortly.",
            timer: 2000,
            showConfirmButton: false,
          });

          // Redirect after 2 seconds
          setTimeout(() => {
            $router.push("/login");
          }, 2000);
        }
       
      }
      
    } catch (error) {
      // Catch and handle any errors during form submission
      console.error('Error register:', error);

      $swal.fire({
        icon: "error",
        title: "An error occurred",
        text: error.message || "Please try again.",
      });
    }
  };


</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <div class="w-full max-w-4xl">
      <rs-card class="w-full h-full px-10 md:px-16 py-12 md:py-20 mb-0">
        <h3 class="mb-4">Sign Up</h3>
        <p class="text-slate-500 mb-6 col-sp">
          Please fill in the form to create an account.
        </p>
        <div class="mb-4">
          <h4 class="col-span-2">Select Your Role</h4>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-6 flex justify-center w-full">
            <div class="flex space-x-4 w-full">
              <!-- Association Option -->
              <div
                :class="[
                  'border-2', // Increase border thickness
                  'border-black', // Set border color to black
                  'p-4', // Padding inside the box
                  'rounded-md', // Rounded corners
                  'w-full', // Full width of each option
                  'bg-black', // Black background by default
                  'text-white', // White text by default
                  'flex', // Flex layout for centering
                  'items-center', // Vertically center content
                  'justify-center', // Horizontally center content
                  roleOption === 'Association' ? 'opacity-100' : 'opacity-50', // Full opacity if selected, reduced opacity if not
                  'transition-opacity duration-300', // Smooth transition for opacity change
                ]"
              >
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Association"
                    v-model="roleOption"
                    class="radio-button accent-purple-600"
                  />
                  <span class="font-bold uppercase">Association</span>
                </label>
              </div>

              <!-- Rehab Center Option -->
              <div
                :class="[
                  'border-2', // Increase border thickness
                  'border-black', // Set border color to black
                  'p-4', // Padding inside the box
                  'rounded-md', // Rounded corners
                  'w-full', // Full width of each option
                  'bg-black', // Black background by default
                  'text-white', // White text by default
                  'flex', // Flex layout for centering
                  'items-center', // Vertically center content
                  'justify-center', // Horizontally center content
                  roleOption === 'Rehab Center'
                    ? 'opacity-100'
                    : 'opacity-50', // Full opacity if selected, reduced opacity if not
                  'transition-opacity duration-300', // Smooth transition for opacity change
                ]"
              >
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Rehab Center"
                    v-model="roleOption"
                    class="radio-button accent-purple-600"
                  />
                  <span class="font-bold uppercase">Rehab Center</span>
                </label>
              </div>
            </div>
          </div>

          <h4 class="col-span-2 mt-4 " v-if="roleOption == 'Association'">Association Details</h4>
          <h4 class="col-span-2 mt-4 " v-if="roleOption == 'Rehab Center'">Rehab Center Details</h4>
          <hr class="border-black w-full border-1 mb-4" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="email" v-model="inputEmail" required >
              <template #label>
                Email <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit :type="passwordVisible ? 'text' : 'password'" v-model="inputPassword" required >
              <template #label>
                Password <span class="text-red-500">*</span>
              </template>
              <template #suffix>
                <button @click="togglePasswordVisibility" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-center items-center">
                  <Icon v-if="passwordVisible" name="material-symbols:visibility" size="19"></Icon>
                  <Icon v-else name="material-symbols:visibility-off" size="19"></Icon>                    
                </button>
              </template>
            </FormKit>

            <FormKit type="text" v-if="roleOption == 'Association'" v-model="inputAssociationSecretKey" required >
              <template #label>
                User Secret Key <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="text" v-if="roleOption == 'Association'" v-model="inputAssociationCategoryCode" required>
              <template #label>
                User Category code <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="select" v-if="roleOption == 'Association'" v-model="inputAssociationCategory" :options="optionAssociationCategory" required >
              <template #label>
                Association Category <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="select" v-if="roleOption == 'Association'" v-model="inputAssociationType" :options="optionAssociationType" required >
              <template #label>
                Association Type <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="select" v-if="roleOption == 'Rehab Center'" v-model="inputRehabCategory" :options="optionRehabCategory" required >
              <template #label>
                Rehab Center Category <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="select" v-if="roleOption == 'Rehab Center'" v-model="inputRehabType" :options="optionRehabType" required >
              <template #label>
                Rehab Center Type <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="text" v-model="inputFullname" required>
              <template #label>
                Full Name <span class="text-red-500">*</span>
              </template>
            </FormKit>
            
            <FormKit type="tel" v-model="inputPhone" required>
              <template #label>
                Phone <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="text" v-model="inputRegistrationNum" required>
              <template #label>
                Registration Number <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="text" v-model="inputLicenseNum" required>
              <template #label>
                License Number <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="textarea" v-if="roleOption == 'Association'" v-model="inputAssociationObjective" class="md:col-span-2" required>
              <template #label>
                Objective <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="textarea" v-if="roleOption == 'Association'" v-model="inputAssociationMembership"  class="md:col-span-2" required>
              <template #label>
                Membership <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="date" v-if="roleOption == 'Association'" v-model="inputAssociationEsablishDate" required>
              <template #label>
                Establishment Date
              </template>
            </FormKit>
            <FormKit type="text" v-if="roleOption == 'Association'" v-model="inputAssociationOperationAreas" required>
              <template #label>
                Operational Areas <span class="text-red-500">*</span>
              </template>
            </FormKit>

            <FormKit type="textarea" v-if="roleOption == 'Rehab Center'" v-model="inputRehabDescription" class="md:col-span-2" required>
              <template #label>
                Description <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="text" v-if="roleOption == 'Rehab Center'" v-model="inputRehabGeolocation"  class="md:col-span-2" required>
              <template #label>
                Geolocation <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="number" v-if="roleOption == 'Rehab Center'" v-model="inputRehabCapacity" required>
              <template #label>
                Center Capacity
              </template>
            </FormKit>
            <FormKit type="text" v-if="roleOption == 'Rehab Center'" v-model="inputRehabOperationHour" required>
              <template #label>
                Operational Hours <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="url" v-model="inputWebsite" required>
              <template #label>
                Website <span class="text-red-500">*</span>
              </template>
            </FormKit>
          </div>
          <h4 class="col-span-2 mt-4" >Address Details</h4>
          <hr class="border-black w-full border-1" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="select" v-model="inputCountry" :options="optionCountries" required>
              <template #label>
                Country <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="select" v-model="inputState" :options="optionStates"  required>
              <template #label>
                State <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="text" v-model="inputPostcode" required >
              <template #label>
                Postcode <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="text" v-model="inputCity" required>
              <template #label>
                City <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="text" v-model="inputAddressLine1" required>
              <template #label>
                Address Line 1 <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="text" v-model="inputAddressLine2">
              <template #label>
                Address Line 2
              </template>
            </FormKit>
          </div>
          <h4 class="col-span-2 mt-4" >Person In Charge Details</h4>
          <hr class="border-black w-full border-1 mb-4" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="text" v-model="inputPICName" required>
              <template #label>
                Name <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="tel" v-model="inputPICContact" required>
              <template #label>
                Contact Number <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="email" v-model="inputPICemail" required>
              <template #label>
                Email Address  <span class="text-red-500">*</span>
              </template>
            </FormKit>
          </div>

          <h4 class="col-span-2 mt-4" >Documents Upload Details</h4>
          <hr class="border-black w-full border-1 mb-4" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="file" v-model="inputLogo1" @change="onChangeFile3" required >
              <template #label>
                Logo <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="file" v-model="inputLicense1" @change="onChangeFile"  required>
              <template #label>
                License Documents <span class="text-red-500">*</span>
              </template>
            </FormKit>
            <FormKit type="file" v-model="inputCertificate1" @change="onChangeFile2" required>
              <template #label>
                Certificates <span class="text-red-500">*</span>
              </template>
            </FormKit>
          </div>          
            
          <!-- Agreement Checkbox -->
          <FormKit type="checkbox" label="agreement" outer-class="col-span-1 md:col-span-2 mt-4" required >
            <template #label>
              I agree to the
              <a class="text-primary hover:underline ml-1">Term and Services</a>
            </template>
          </FormKit>

          <!-- Submit Button -->
          <FormKit type="submit" @click="handleSubmit" input-class="w-full">
            Sign up
          </FormKit>
        </form>
        <!-- Redirect to Login -->
        <p class="mt-3 text-center text-slate-500">
          Already have an account?
          <NuxtLink to="/login" class="text-primary hover:underline">
            Login
          </NuxtLink>
        </p>
      </rs-card>
    </div>
  </div>
</template>

<style scoped>
.radio-button:checked + label {
  border-color: purple;
}

/* Optional: Adjust background and text color for better visibility */
.bg-purple-100 {
  background-color: #e9d5ff;
}
</style>
