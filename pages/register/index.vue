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

  const emailError=ref('');
  const passwordError=ref('');

  const secretKeyError=ref('');
  const categoryCodeError=ref('');
  const associationCategoryError=ref(''); 
  const associationTypeError=ref('');  
  const rehabCategoryError=ref('');
  const rehabTypeError=ref('');
  const fullnameError=ref('');
  const phoneError=ref('');
  const registrationNumError=ref('');
  const licenseNumError=ref('');
  const associationObjectiveError=ref('');
  const associationMembershipError=ref('');
  const associationEsablishDateError=ref('');
  const associationOperationAreasError=ref('');
  const rehabDescriptionError=ref('');
  const rehabGeolocationError=ref('');
  const rehabCapacityError=ref('');
  const rehabOperationHourError=ref('');

  const countryError=ref('');
  const stateError=ref('');
  const postcodeError=ref('');
  const cityError=ref('');
  const addressLine1Error=ref('');
  const addressLine2Error=ref('');
  const PICNameError=ref('');
  const PICContactError=ref('');
  const PICemailError=ref('');

  const license1Error=ref('');
  const certificate1Error=ref('');
  const logo1Error=ref('');
  const agreementError=ref('');

  const websiteError=ref('');
  
  

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    // Basic phone validation - adjust regex based on your needs
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validateWebsite = (url) => {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(url);
  };

  const validateFields = () => {
    let isValid = true;
    // Reset all errors
    emailError.value = '';
    passwordError.value = '';
    secretKeyError.value = '';
    categoryCodeError.value = '';
    associationCategoryError.value = '';
    associationTypeError.value = '';
    rehabCategoryError.value = '';
    rehabTypeError.value = '';
    fullnameError.value = '';
    phoneError.value = '';
    registrationNumError.value = '';
    licenseNumError.value = '';
    websiteError.value = '';
    addressLine1Error.value = '';
    cityError.value = '';
    postcodeError.value = '';
    stateError.value = '';
    countryError.value = '';
    PICNameError.value = '';
    PICContactError.value = '';
    PICemailError.value = '';
    license1Error.value = '';
    certificate1Error.value = '';
    logo1Error.value = '';

    // Common validations for both roles
    if (!inputEmail.value) {
        emailError.value = 'Email is required';
        isValid = false;
    } else if (!validateEmail(inputEmail.value)) {
        emailError.value = 'Please enter a valid email address';
        isValid = false;
    }

    if (!inputPassword.value) {
        passwordError.value = 'Password is required';
        isValid = false;
    } else if (!validatePassword(inputPassword.value)) {
        passwordError.value = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        isValid = false;
    }

    if (!inputFullname.value) {
        fullnameError.value = 'Full name is required';
        isValid = false;
    }

    if (!inputPhone.value) {
        phoneError.value = 'Phone number is required';
        isValid = false;
    } else if (!validatePhone(inputPhone.value)) {
        phoneError.value = 'Please enter a valid phone number';
        isValid = false;
    }

    if (!inputRegistrationNum.value) {
        registrationNumError.value = 'Registration number is required';
        isValid = false;
    }

    if (!inputLicenseNum.value) {
        licenseNumError.value = 'License number is required';
        isValid = false;
    }

    if (!inputWebsite.value) {
        websiteError.value = 'Website is required';
        isValid = false;
    } else if (!validateWebsite(inputWebsite.value)) {
        websiteError.value = 'Please enter a valid website URL';
        isValid = false;
    }

    // Address validations
    if (!inputAddressLine1.value) {
        addressLine1Error.value = 'Address is required';
        isValid = false;
    }

    if (!inputCity.value) {
        cityError.value = 'City is required';
        isValid = false;
    }

    if (!inputPostcode.value) {
        postcodeError.value = 'Postcode is required';
        isValid = false;
    }

    if (!inputState.value) {
        stateError.value = 'State is required';
        isValid = false;
    }

    if (!inputCountry.value) {
        countryError.value = 'Country is required';
        isValid = false;
    }

    // PIC validations
    if (!inputPICName.value) {
        PICNameError.value = 'PIC name is required';
        isValid = false;
    }

    if (!inputPICContact.value) {
        PICContactError.value = 'PIC contact is required';
        isValid = false;
    } else if (!validatePhone(inputPICContact.value)) {
        PICContactError.value = 'Please enter a valid phone number';
        isValid = false;
    }

    if (!inputPICemail.value) {
        PICemailError.value = 'PIC email is required';
        isValid = false;
    } else if (!validateEmail(inputPICemail.value)) {
        PICemailError.value = 'Please enter a valid email address';
        isValid = false;
    }

    // Role-specific validations
    // alert(inputRehabDescription.value);
    if (roleOption.value === 'Association') {
        if (!inputAssociationSecretKey.value) {
            secretKeyError.value = 'Secret key is required';
            isValid = false;
        }

        if (!inputAssociationCategoryCode.value) {
            categoryCodeError.value = 'Category code is required';
            isValid = false;
        }

        if (!inputAssociationCategory.value) {
            associationCategoryError.value = 'Association category is required';
            isValid = false;
        }

        if (!inputAssociationType.value) {
            associationTypeError.value = 'Association type is required';
            isValid = false;
        }

        if (!inputAssociationObjective.value) {
            associationObjectiveError.value = 'Objective is required';
            isValid = false;
        }

        if (!inputAssociationMembership.value) {
            associationMembershipError.value = 'Membership is required';
            isValid = false;
        }

        if (!inputAssociationEsablishDate.value) {
            associationEsablishDateError.value = 'Establishment date is required';
            isValid = false;
        }

        if (!inputAssociationOperationAreas.value) {
            associationOperationAreasError.value = 'Operation areas are ';
            isValid = false;
        }
    } 
    else if (roleOption.value === 'Rehab Center') 
    {
        // Rehab Center validations
        if (!inputRehabCategory.value) {
            rehabCategoryError.value = 'Rehab category is required';
            isValid = false;
        }

        if (!inputRehabType.value) {
            rehabTypeError.value = 'Rehab type is required';
            isValid = false;
        }

        if (!inputRehabDescription.value) {
            rehabDescriptionError.value = 'Description is required';
            isValid = false;
        }

        if (!inputRehabGeolocation.value) {
            rehabGeolocationError.value = 'Geolocation is required';
            isValid = false;
        }

        if (!inputRehabCapacity.value) {
            rehabCapacityError.value = 'Capacity is required';
            isValid = false;
        }

        if (!inputRehabOperationHour.value) {
            rehabOperationHourError.value = 'Operation hours are ';
            isValid = false;
        }
    }

    // Document upload validations 
    if (!logoFile.value) {
        logo1Error.value = 'Logo is required';
        isValid = false;
    }

    if (!licensesFile.value ) {
        license1Error.value = 'License document is required';
        isValid = false;
    }

    if (!certificatesFile.value ) {
        certificate1Error.value = 'Certificate is required';
        isValid = false;
    }

    return isValid;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      if (!validateFields()) {
        return;
      }

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
            <div class="mb-1">
                <FormKit type="email"  v-model="inputEmail" :class="{'border-red-500': emailError}" placeholder="example@gmail.com">
                  <template #label>
                    Email <span class="text-red-500">*</span>
                  </template>
                </FormKit>
                <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>
            </div>

            <div class="mb-1">
                <FormKit :type="passwordVisible ? 'text' : 'password'" v-model="inputPassword"  >
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
                <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
              <FormKit type="text"  v-model="inputAssociationSecretKey" placeholder="lumfpz1b-srnf-z8s7-nes8-o0tdbi3jgfgd" >
                <template #label>
                  User Secret Key <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="secretKeyError" class="text-red-500 text-sm">{{ secretKeyError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
              <FormKit type="text"  v-model="inputAssociationCategoryCode" placeholder="vz1kchsl12">
                <template #label>
                  User Category code <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="categoryCodeError" class="text-red-500 text-sm">{{ categoryCodeError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
              <FormKit type="select" v-model="inputAssociationCategory" :options="optionAssociationCategory"  >
                <template #label>
                  Association Category <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="associationCategoryError" class="text-red-500 text-sm">{{ associationCategoryError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
              <FormKit type="select"  v-model="inputAssociationType" :options="optionAssociationType"  >
                <template #label>
                  Association Type <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="associationTypeError" class="text-red-500 text-sm">{{ associationTypeError }}</p>
            </div>

            <div class="mb-1"  v-if="roleOption == 'Rehab Center'">
              <FormKit type="select" v-model="inputRehabCategory" :options="optionRehabCategory"  >
                <template #label>
                  Rehab Center Category <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="rehabCategoryError" class="text-red-500 text-sm">{{ rehabCategoryError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Rehab Center'">
              <FormKit type="select"  v-model="inputRehabType" :options="optionRehabType"  >
                <template #label>
                  Rehab Center Type <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="rehabTypeError" class="text-red-500 text-sm">{{ rehabTypeError }}</p>
            </div>

            <div class="mb-1" >
              <FormKit type="text" v-model="inputFullname" placeholder="Malaysian Medical Association (MMA) or Pusat Rehabilitasi PERKESO">
                <template #label>
                  Full Name <span class="text-red-500">*</span>
                </template>
              </FormKit>              
              <p v-if="fullnameError" class="text-red-500 text-sm">{{ fullnameError }}</p>
            </div>

            <div class="mb-1" >
              <FormKit type="tel" v-model="inputPhone" placeholder="0123456789">
                <template #label>
                  Phone <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="phoneError" class="text-red-500 text-sm">{{ phoneError }}</p>
            </div>

            <div class="mb-1" >
              <FormKit type="text" v-model="inputRegistrationNum" placeholder="1234567-A">
                <template #label>
                  Registration Number <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="registrationNumError" class="text-red-500 text-sm">{{ registrationNumError }}</p>
            </div>

            <div class="mb-1" >
              <FormKit type="text" v-model="inputLicenseNum" placeholder="MMC12345">
                <template #label>
                  License Number <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="licenseNumError" class="text-red-500 text-sm">{{ licenseNumError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
              <FormKit type="textarea"  v-model="inputAssociationObjective" class="md:col-span-2" placeholder="Enter Objective">
                <template #label>
                  Objective <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="associationObjectiveError" class="text-red-500 text-sm">{{ associationObjectiveError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
              <FormKit type="textarea"  v-model="inputAssociationMembership"  class="md:col-span-2" placeholder="Enter Membership">
                <template #label>
                  Membership <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="associationMembershipError" class="text-red-500 text-sm">{{ associationMembershipError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
              <FormKit type="date"  v-model="inputAssociationEsablishDate" >
                <template #label>
                  Establishment Date
                </template>
              </FormKit>
              <p v-if="associationEsablishDateError" class="text-red-500 text-sm">{{ associationEsablishDateError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Association'">
                <FormKit type="text"  v-model="inputAssociationOperationAreas" placeholder="local, national, international" >
                  <template #label>
                    Operational Areas <span class="text-red-500">*</span>
                  </template>
                </FormKit>
                <p v-if="associationOperationAreasError" class="text-red-500 text-sm">{{ associationOperationAreasError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Rehab Center'">
                <FormKit type="textarea"  v-model="inputRehabDescription" class="md:col-span-2" placeholder="Enter Description" >
                  <template #label>
                    Description <span class="text-red-500">*</span>
                  </template>
                </FormKit>
              <p v-if="rehabDescriptionError" class="text-red-500 text-sm">{{ rehabDescriptionError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Rehab Center'">
                <FormKit type="text"  v-model="inputRehabGeolocation"  class="md:col-span-2" placeholder="Enter Geolocation" >
                  <template #label>
                    Geolocation <span class="text-red-500">*</span>
                  </template>
                </FormKit>
                <p v-if="rehabGeolocationError" class="text-red-500 text-sm">{{ rehabGeolocationError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Rehab Center'">
                <FormKit type="number"  v-model="inputRehabCapacity" placeholder="100" >
                  <template #label>
                    Center Capacity
                  </template>
                </FormKit>
                <p v-if="rehabCapacityError" class="text-red-500 text-sm">{{ rehabCapacityError }}</p>
            </div>

            <div class="mb-1" v-if="roleOption == 'Rehab Center'">
                <FormKit type="text"  v-model="inputRehabOperationHour" placeholder="09:00 - 18:00" >
                  <template #label>
                    Operational Hours <span class="text-red-500">*</span>
                  </template>
                </FormKit>
              <p v-if="rehabOperationHourError" class="text-red-500 text-sm">{{ rehabOperationHourError }}</p>
            </div>

            <div class="mb-1" >
              <FormKit type="url" v-model="inputWebsite" placeholder="https://www.example.com" >
                <template #label>
                  Website <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="websiteError" class="text-red-500 text-sm">{{ websiteError }}</p>
            </div>   
          </div>

          <h4 class="col-span-2 mt-4" >Address Details</h4>
          <hr class="border-black w-full border-1" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-1">
              <FormKit type="select" v-model="inputCountry" :options="optionCountries" >
                <template #label>
                  Country <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="countryError" class="text-red-500 text-sm">{{ countryError }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="select" v-model="inputState" :options="optionStates"  >
                <template #label>
                  State <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="stateError" class="text-red-500 text-sm">{{ stateError }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="text" v-model="inputPostcode"  placeholder="123456" >
                <template #label>
                  Postcode <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="postcodeError" class="text-red-500 text-sm">{{ postcodeError }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="text" v-model="inputCity" placeholder="Kuala Lumpur" >
                <template #label>
                  City <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="cityError" class="text-red-500 text-sm">{{ cityError }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="text" v-model="inputAddressLine1" placeholder="No. 1, Jalan Ampang, 50450 Kuala Lumpur" >
                <template #label>
                  Address Line 1 <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="addressLine1Error" class="text-red-500 text-sm">{{ addressLine1Error }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="text" v-model="inputAddressLine2" placeholder="No. 1, Jalan Ampang, 50450 Kuala Lumpur" >
                <template #label>
                  Address Line 2
                </template>
              </FormKit>
              <p v-if="addressLine2Error" class="text-red-500 text-sm">{{ addressLine2Error }}</p>
            </div>         
          </div>
          <h4 class="col-span-2 mt-4" >Person In Charge Details</h4>
          <hr class="border-black w-full border-1 mb-4" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-1">
              <FormKit type="text" v-model="inputPICName" placeholder="MR. ABDUL AZIZ BIN ABDUL RAHMAN" >
                <template #label>
                  Name <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="PICNameError" class="text-red-500 text-sm">{{ PICNameError }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="tel" v-model="inputPICContact" placeholder="0123456789" >
                <template #label>
                  Contact Number <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="PICContactError" class="text-red-500 text-sm">{{ PICContactError }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="email" v-model="inputPICemail" placeholder="example@gmail.com" >
                <template #label>
                  Email Address  <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="PICemailError" class="text-red-500 text-sm">{{ PICemailError }}</p>
            </div>      
          </div>

          <h4 class="col-span-2 mt-4" >Documents Upload Details</h4>
          <hr class="border-black w-full border-1 mb-4" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-1">
              <FormKit type="file" v-model="inputLogo1" @change="onChangeFile3"  >
                <template #label>
                  Logo <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="logo1Error" class="text-red-500 text-sm">{{ logo1Error }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="file" v-model="inputLicense1" @change="onChangeFile"  >
                <template #label>
                  License Documents <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="license1Error" class="text-red-500 text-sm">{{ license1Error }}</p>
            </div>

            <div class="mb-1">
              <FormKit type="file" v-model="inputCertificate1" @change="onChangeFile2" >
                <template #label>
                  Certificates <span class="text-red-500">*</span>
                </template>
              </FormKit>
              <p v-if="certificate1Error" class="text-red-500 text-sm">{{ certificate1Error }}</p>
            </div>
          </div>          
            
          <!-- Agreement Checkbox -->
          <FormKit type="checkbox" label="agreement" outer-class="col-span-1 md:col-span-2 mt-4"  >
            <template #label>
              I agree to the
              <a class="text-primary hover:underline ml-1">Term and Services</a>
            </template>
          </FormKit>

          <!-- Submit Button -->
          <FormKit type="button" @click="handleSubmit" input-class="w-full">
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
