<script setup>
    definePageMeta({
        title: "Create Rehab Center ",
    });
      
    const { $swal, $router } = useNuxtApp();

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
        geolocation: '',
        licensesFile :null,
        licensesFileName :null,
        certificatesFile :null,
        certificatesFileName :null,
    });

    formData.value.userUsername=formData.value.userEmail;

    
    // Dropdown options
    const categories = ref([]);
    const states = ref([]);
    const countries = ref([]);
    const associationTypes = ref([]);
  
    // Fetch dropdown options on mounted
    onMounted(async () => 
    {
        // Fetch categories (rehab_center type only)
        const categoryData = await $fetch('/api/rehab-center/category', {
            method: 'GET'
        });
        categories.value = categoryData.data.map(category => ({ value: category.category_id, label: category.name }));
        categories.value.unshift({ value: "", label: "Please choose" });
        // Fetch lookup data for states, countries, and association types
        const lookupData = await $fetch('/api/lookup', {
            method: 'GET'
        });
        states.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
        // Add placeholder option
        states.value.unshift({ value: "", label: "Please choose" });
        
        countries.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
        // Add placeholder option
        countries.value.unshift({ value: "", label: "Please choose" });
        
        associationTypes.value = lookupData.data.filter(item => item.lookupType === 'associationType_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
        // Add placeholder option
        associationTypes.value.unshift({ value: "", label: "Please choose" });  
    });

    // Password visibility toggle
    const passwordVisible = ref(false);
    const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value;
    };
  
    // Form submission handler
    const submitForm = async () => {
        try { 
          //check username
          const { data:checkusername } = await useFetch("/api/checkusername", {
            method: 'POST',
            body: {
              userUsername: formData.value.userEmail,    
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
            // upload image
            const { data:uploadImageLicenses } = await useFetch("/api/rehab-center/upload", {
              method: 'POST',
              body: {
                base64Data: formData.value.licensesFile,
                fileName: formData.value.licensesFileName,              
              },
            });

            if(uploadImageLicenses.value.respond == 200) 
            {
              formData.value.document_licenses = uploadImageLicenses.value.data.filePath;
              // console.log("path1:", uploadImageLicenses.value.data.filePath);            
              // console.log("licences:", formData.value.document_licenses);
              // upload image
              const { data:uploadImageCertificates } = await useFetch("/api/rehab-center/upload", {
                method: 'POST',
                body: {
                  base64Data: formData.value.certificatesFile,
                  fileName: formData.value.certificatesFileName,              
                },
              });

              if(uploadImageCertificates.value.respond == 200) 
              {
                formData.value.documents_certificates = uploadImageCertificates.value.data.filePath;
                // console.log("path2:", uploadImageCertificates.value.data.filePath);            
                // console.log("data:", uploadImageCertificates.value.data.filePath);            

                const { data: add } = await useFetch('/api/rehab-center/create', {
                  method: 'POST',
                  body: JSON.stringify({
                    userUsername: formData.value.userEmail,
                    userPassword: formData.value.userPassword,
                    userFullName: formData.value.userFullName ,
                    userEmail: formData.value.userEmail ,
                    userPhone: formData.value.userPhone ,
                    center_category: formData.value.center_category ,
                    center_address_line1: formData.value.center_address_line1 ,
                    center_address_line2: formData.value.center_address_line2 ,
                    center_address_city: formData.value.center_address_city ,
                    center_address_postcode: formData.value.center_address_postcode ,
                    center_address_state: formData.value.center_address_state ,
                    center_address_country: formData.value.center_address_country ,
                    registration_number: formData.value.registration_number ,
                    license_number: formData.value.license_number ,
                    contact_number: formData.value.contact_number ,
                    email_address: formData.value.email_address ,
                    center_type: formData.value.center_type ,
                    person_in_charge: formData.value.person_in_charge ,
                    center_capacity: formData.value.center_capacity ,
                    operational_hours: formData.value.operational_hours ,
                    website: formData.value.website ,
                    document_licenses: uploadImageLicenses.value.data.filePath,
                    documents_certificates: uploadImageCertificates.value.data.filePath,
                    center_description: formData.value.center_description ,
                    geolocation: formData.value.geolocation ,
                  })
              });

              // alert(add.value.response);
              if (add.value.response === 200) 
              {
                  $swal.fire({
                      position: "center",
                      title: "Success",
                      text: 'Rehab center created successfully!',
                      icon: "success",
                      timer: 1500,
                      showConfirmButton: false,
                  });

                  setTimeout(() => {
                    $router.push("/rehab-center/list");
                  }, 1000);
                  // await router.push('/rehab-center/list');
              }            
              else 
              {              
                  $swal.fire({
                      icon: "error",
                      title: "Error",
                      text: add.value.error || 'An unexpected error occurred.',
                  });
                  
              }
                
              }
              else 
              {
                $swal.fire({
                  position: "center",
                  icon: "error",
                  title: "Error",
                  text: " Fail to upload certificate.",
                });
              }
            } 
            else 
            {
              $swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: " Fail to upload licences.",
              });
            }
          }
          

            
        }
        catch (error) 
        {
            // console.error("Failed to submit form:", error);
            alert("An error occurred while submitting the form.");
        }
    };

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
    
    const onChangeFile2 = async (event) => {      
      const file = event.target.files[0];  // Get the first file from the input
      const fileType = file.type;

      try {
        
        if (fileType.startsWith('image/')) {
          const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
          const base64Data = await ToBase64OpsImage(compressedImage);
          
          formData.value.certificatesFile = base64Data;  // Store the file in your form data
          formData.value.certificatesFileName = file.name; 
        }
        else if (fileType === 'application/pdf') {
          const base64Data = await ToBase64OpsImage(file);

          formData.value.certificatesFile = base64Data;  // Store the file in your form data
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
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">Create Rehab Center</h2>
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="email" v-model="formData.userEmail" required>
            <template #label>
              Email <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit :type="passwordVisible ? 'text' : 'password'" v-model="formData.userPassword"  required>
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
        </div>
  
        <!-- User Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Center Info -->
          <FormKit type="select" v-model="formData.center_category" :options="categories" required>
            <template #label>
              Center Category <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="select" v-model="formData.center_type" :options="associationTypes" required>
            <template #label>
              Center Type <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="text" v-model="formData.userFullName" required>
            <template #label>
              Full Name <span class="text-red-500">*</span>
            </template>
          </FormKit>
          
          <FormKit type="tel" v-model="formData.userPhone" required>
            <template #label>
              Phone <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="textarea" v-model="formData.center_description" class="md:col-span-2" required>
            <template #label>
              Description <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.geolocation"  class="md:col-span-2" required>
            <template #label>
              Geolocation <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="text" v-model="formData.registration_number" required>
            <template #label>
              Registration Number <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.license_number" required>
            <template #label>
              License Number <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormKit type="select" v-model="formData.center_address_country" :options="countries" required>
            <template #label>
              Country <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="select" v-model="formData.center_address_state" :options="states" required >
            <template #label>
              State <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.center_address_postcode" required >
            <template #label>
              Postcode <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormKit type="text" v-model="formData.center_address_line1" required>
            <template #label>
              Address Line 1 <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.center_address_line2">
            <template #label>
              Address Line 2
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.center_address_city" required>
            <template #label>
              City <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Contact Info -->
          <FormKit type="text" v-model="formData.person_in_charge" required>
            <template #label>
              Person in Charge Name <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="tel" v-model="formData.contact_number" required>
            <template #label>
              PIC Contact Number <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="email" v-model="formData.email_address" required>
            <template #label>
              PIC Email Address  <span class="text-red-500">*</span>
            </template>
          </FormKit>
          
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormKit type="number" v-model="formData.center_capacity">
            <template #label>
              Center Capacity
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.operational_hours" required>
            <template #label>
              Operational Hours <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="url" v-model="formData.website" required>
            <template #label>
              Website <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <FormKit type="file" v-model="formData.document_licenses" accept="image/*" @change="onChangeFile" required >
            <template #label> 
              License  <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="file" v-model="formData.documents_certificates" accept="image/*" @change="onChangeFile2" required>
            <template #label>
              Certificates <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>    
  
        <!-- Submit Button -->
        <div class="md:col-span-2 mt-6">
          <rs-button variant="primary" type="submit">Submit</rs-button>
        </div>
      </form>
    </div>
</template>
  
<style scoped>
  /* Additional styling can be applied here */
</style>
  