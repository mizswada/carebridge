<script setup>
    definePageMeta({
        title: "Create Association ",
    });
      
    const { $swal, $router } = useNuxtApp();

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
  
    // Fetch dropdown options on mounted
    onMounted(async () => 
    {
        // Fetch categories (rehab_association type only)
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

    //license
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

    //certificate
    const onChangeFile2 = async (event) => {      
      const file = event.target.files[0];  // Get the first file from the input
      const fileType = file.type;

      try {
        
        if (fileType.startsWith('image/')) {
          const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
          const base64Data2 = await ToBase64OpsImage(compressedImage);
          
          formData.value.certificatesFile = base64Data2;  // Store the file in your form data
          formData.value.certificatesFileName = file.name; 
        }
        else if (fileType === 'application/pdf') {
          const base64Data2 = await ToBase64OpsImage(file);

          formData.value.certificatesFile = base64Data2;  // Store the file in your form data
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

    //logo
    const onChangeFile3 = async (event) => {      
      const file = event.target.files[0];  // Get the first file from the input
      const fileType = file.type;

      try {
        
        if (fileType.startsWith('image/')) {
          const compressedImage = await resizeAndCompressImage(file, 800, 600, 0.7);
          const base64Data3 = await ToBase64OpsImage(compressedImage);
          
          formData.value.logoFile = base64Data3;  // Store the file in your form data
          formData.value.logoFileName = file.name; 
        }
        else if (fileType === 'application/pdf') {
          const base64Data3 = await ToBase64OpsImage(file);

          formData.value.logoFile = base64Data3;  // Store the file in your form data
          formData.value.logoFileName = file.name;
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

    // Form submission handler
    const submitForm = async () => {
        try { 
          //check username
          const { data:checkusername } = await useFetch("/api/checkusername", {
            method: 'POST',
            body: {
              userUsername: formData.value.userUsername,    
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
            // upload image licenses
            const { data:uploadImageLicenses } = await useFetch("/api/association/upload", {
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

              //upload image certificate
              const { data:uploadImageCertificates } = await useFetch("/api/association/upload", {
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
                
                const { data:uploadImageLogo } = await useFetch("/api/association/upload", {
                  method: 'POST',
                  body: {
                    base64Data: formData.value.logoFile,
                    fileName: formData.value.logoFileName,              
                  },
                });

                if(uploadImageLogo.value.respond == 200) 
                {
                  formData.value.document_logo = uploadImageLogo.value.data.filePath;
                  // console.log("path3:", uploadImageLogo.value.data.filePath);  
                  
                  const { data: add } = await useFetch('/api/association/create', {
                    method: 'POST',
                    body: JSON.stringify({
                      userUsername: formData.value.userEmail,
                      userPassword: formData.value.userPassword,
                      category_code:formData.value.category_code,
                      secret_key:formData.value.secret_key,

                      userFullName: formData.value.userFullName ,
                      userEmail: formData.value.userEmail ,                     
                      userPhone: formData.value.userPhone ,

                      association_category: formData.value.association_category ,
                      registration_number: formData.value.registration_number ,
                      license_number: formData.value.license_number ,
                      membership: formData.value.membership ,
                      establishment_date: formData.value.establishment_date ,
                      association_type: formData.value.association_type ,
                      objective: formData.value.objective ,
                      website: formData.value.website ,
                      document_logo: uploadImageLogo.value.data.filePath,
                      operational_areas: formData.value.operational_areas ,


                      association_address_line1: formData.value.association_address_line1 ,
                      association_address_line2: formData.value.association_address_line2 ,
                      association_address_city: formData.value.association_address_city ,
                      association_address_postcode: formData.value.association_address_postcode ,
                      association_address_state: formData.value.association_address_state ,
                      association_address_country: formData.value.association_address_country ,
                      
                      contact_number: formData.value.contact_number ,
                      email_address: formData.value.email_address ,                      
                      person_in_charge: formData.value.person_in_charge ,             
                      
                      document_licenses: uploadImageLicenses.value.data.filePath,
                      documents_certificates: uploadImageCertificates.value.data.filePath,                     
                      
                    })
                  });

                  // alert(add.value.response);
                  if (add.value.response === 200) 
                  {
                      $swal.fire({
                          position: "center",
                          title: "Success",
                          text: 'Association created successfully!',
                          icon: "success",
                          timer: 1500,
                          showConfirmButton: false,
                      });

                      setTimeout(() => {
                        $router.push("/association/list");
                      }, 1000);
                      // await router.push('/association/list');
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

</script>

<template>
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">Create Association</h2>
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
              <button @click="togglePasswordVisibility" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-association items-association">
                <Icon v-if="passwordVisible" name="material-symbols:visibility" size="19"></Icon>
                <Icon v-else name="material-symbols:visibility-off" size="19"></Icon>                    
              </button>
            </template>
          </FormKit>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="text" v-model="formData.secret_key" required>
            <template #label>
              User Secret Key <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.category_code" required>
            <template #label>
              User Category code <span class="text-red-500">*</span>
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
        
        <!-- User Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- association Info -->
          <FormKit type="select" v-model="formData.association_category" :options="categories" required>
            <template #label>
              Association Category <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="select" v-model="formData.association_type" :options="associationTypes" required>
            <template #label>
              Association Type <span class="text-red-500">*</span>
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
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit type="textarea" v-model="formData.objective" class="md:col-span-2" required>
            <template #label>
              Objective <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="textarea" v-model="formData.membership"  class="md:col-span-2" required>
            <template #label>
              Membership <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormKit type="date" v-model="formData.establishment_date">
            <template #label>
              Establishment Date
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.operational_areas" required>
            <template #label>
              Operational Areas <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="url" v-model="formData.website" required>
            <template #label>
              Website <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
        
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormKit type="select" v-model="formData.association_address_country" :options="countries" required>
            <template #label>
              Country <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="select" v-model="formData.association_address_state" :options="states" required >
            <template #label>
              State <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.association_address_postcode" required >
            <template #label>
              Postcode <span class="text-red-500">*</span>
            </template>
          </FormKit>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormKit type="text" v-model="formData.association_address_line1" required>
            <template #label>
              Address Line 1 <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.association_address_line2">
            <template #label>
              Address Line 2
            </template>
          </FormKit>
          <FormKit type="text" v-model="formData.association_address_city" required>
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
          <FormKit type="file" v-model="formData.document_logo" @change="onChangeFile3" required >
            <template #label>
              Logo <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="file" v-model="formData.document_licenses" @change="onChangeFile" required >
            <template #label>
              License Documents <span class="text-red-500">*</span>
            </template>
          </FormKit>
          <FormKit type="file" v-model="formData.documents_certificates" @change="onChangeFile2" required>
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
  