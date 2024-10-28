<script setup>
    definePageMeta({
        title: "Admin Management",
    });
    const { $swal, $router } = useNuxtApp();

    const modalEdit = ref(false);
    const modalAdd = ref(false);
    const modalDelete = ref(false);

    const selectedAdmin = ref(null);

    const admins = ref(null);
    const states = ref([]);
    const countries = ref([]);
    const genders = ref([]);
    const field =['name', 'email' ,'contact','status','action'];

    const passwordVisible = ref(false);
    const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value;
    };
    
    

    const inputUsername = ref('');
    const inputPassword = ref('');
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

    const errorUsername = ref('');
    const errorPassword = ref('');
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

    //dropdown value
    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    states.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    states.value.unshift({ value: "", label: "Please choose" });
    
    countries.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    countries.value.unshift({ value: "", label: "Please choose" });

    genders.value = lookupData.data.filter(item => item.lookupType === 'gender_type').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    genders.value.unshift({ value: "", label: "Please choose" });
   
    // list
    const admin = await useFetch('/api/admin/list');
    if(admin.data.value.response == 200){
        admins.value = admin.data.value.data;
    }
    else{
        alert("An error occurred while fetching admins. Please try again.");
    }

    const validateFields = () => {
        let isValid = true;
        // Reset errors
        errorUsername.value = '';
        errorPassword.value = '';
        errorName.value = '';
        errorEmail.value = '';
        errorContact.value = '';
        errorDOB.value = '';
        errorGender.value = '';
        errorLine1.value = '';
        errorLine2.value = '';
        errorCity.value = '';
        errorPostcode.value = '';
        errorState.value = '';
        errorCountry.value = '';

        // Check each required field
        if (!inputUsername.value) {
            errorUsername.value = 'Username is required';
            isValid = false;
        }
        if (!inputPassword.value) {
            errorPassword.value = 'Password is required';
            isValid = false;
        }
        if (!inputName.value) {
            errorName.value = 'Name is required';
            isValid = false;
        }
        if (!inputEmail.value) {
            errorEmail.value = 'email is required';
            isValid = false;
        }
        if (!inputContact.value) {
            errorContact.value = 'Phone Num is required';
            isValid = false;
        }
        if (!inputDOB.value) {
            errorDOB.value = 'Date of Birth is required';
            isValid = false;
        }
        if (!inputGender.value) {
            errorGender.value = 'Gender is required';
            isValid = false;
        }
        if (!inputLine1.value) {
            errorLine1.value = 'Address Line 1 is required';
            isValid = false;
        }
        if (!inputCity.value) {
            errorCity.value = 'City is required';
            isValid = false;
        }
        if (!inputPostcode.value) {
            errorPostcode.value = 'Postcode is required';
            isValid = false;
        }
        if (!inputState.value) {
            errorState.value = 'State is required';
            isValid = false;
        }
        if (!inputCountry.value) {
            errorCountry.value = 'Country is required';
            isValid = false;
        }

        return isValid;
    };

    const validateFieldsEdit = () => {
        let isValid = true;
        // Reset errors
        errorName.value = '';
        errorEmail.value = '';
        errorContact.value = '';
        errorDOB.value = '';
        errorGender.value = '';
        errorLine1.value = '';
        errorLine2.value = '';
        errorCity.value = '';
        errorPostcode.value = '';
        errorState.value = '';
        errorCountry.value = '';

        // Check each required field
        if (!inputName.value) {
            errorName.value = 'Name is required';
            isValid = false;
        }
        if (!inputEmail.value) {
            errorEmail.value = 'email is required';
            isValid = false;
        }
        if (!inputContact.value) {
            errorContact.value = 'Phone Num is required';
            isValid = false;
        }
        if (!inputDOB.value) {
            errorDOB.value = 'Date of Birth is required';
            isValid = false;
        }
        if (!inputGender.value) {
            errorGender.value = 'Gender is required';
            isValid = false;
        }
        if (!inputLine1.value) {
            errorLine1.value = 'Address Line 1 is required';
            isValid = false;
        }
        if (!inputCity.value) {
            errorCity.value = 'City is required';
            isValid = false;
        }
        if (!inputPostcode.value) {
            errorPostcode.value = 'Postcode is required';
            isValid = false;
        }
        if (!inputState.value) {
            errorState.value = 'State is required';
            isValid = false;
        }
        if (!inputCountry.value) {
            errorCountry.value = 'Country is required';
            isValid = false;
        }

        return isValid;
    };

    //add
    const closeAdd= () =>{
      modalAdd.value = false;
    };

    // clickAdd
    const clickAdd = async () => {
        if (!validateFields()) {
            return; // Stop if form is invalid
        }
        try {
            //check username
            const { data:checkusername } = await useFetch("/api/checkusername", {
                method: 'POST',
                body: {
                userUsername: inputUsername.value,    
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
                const { data: add } = await useFetch("/api/admin/create", {
                    method: "POST",
                    body: JSON.stringify({ 
                        userUsername: inputUsername.value ,
                        userPassword: inputPassword.value ,
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

                if (add.value.response === 200) 
                {
                modalAdd.value = false;
                $swal.fire({
                    position: "center",
                    title: "Success",
                    text: add.value.message,
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
                    alert("Admin failed to create.");
                }
            }            
        } 
        catch (error) 
        {
            console.error("Failed to created admin", error);
            alert("An error occurred while created admin details. Please try again.");
        }
    };

    const formatDate = (isoString) => {
      const date = new Date(isoString);
      
      // Extract day, month, year, hours, minutes, and seconds
      const day = String(date.getDate()).padStart(2, "0");      // Ensure 2 digits for day
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month (months are 0-indexed)
      const year = date.getFullYear();                           // Full year

      // Return the formatted string
      return `${year}-${month}-${day}`;
    };
    
    // edit
    const closeEdit= () =>{
      modalEdit.value = false;
    };    
    
    const editButton = async  (id) =>
    {       
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
                inputName.value = detail.value.data.user.userFullName ,
                inputEmail.value = detail.value.data.user.userEmail,
                inputContact.value = detail.value.data.user.userPhone  ,
                inputDOB.value = formatDate(detail.value.data.details.admin_date_of_birth) ,
                inputGender.value = detail.value.data.details.admin_gender ,
                inputLine1.value = detail.value.data.details.admin_address_line1 ,
                inputLine2.value = detail.value.data.details.admin_address_line2 ,
                inputCity.value = detail.value.data.details.admin_address_city ,
                inputPostcode.value = detail.value.data.details.admin_address_postcode ,
                inputState.value = detail.value.data.details.admin_address_state ,
                inputCountry.value = detail.value.data.details.admin_address_country ,
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
    };

    const clickUpdate = async () => {
      try {
        
        if (!validateFieldsEdit()) {
            return; // Stop if form is invalid
        }

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

    //delete
    const closeDelete= () =>{
      modalDelete.value = false;
    };
    
    const confirmDelete = (id) => {
        selectedAdmin.value = id;
        modalDelete.value = true;
    };
    
    const clickDelete = async () => 
    {
      try {
        const { data:deleted} = await useFetch("/api/admin/delete", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedAdmin.value,
            }),
        });        

        if (deleted.value.response === 200) 
        {
          modalDelete.value = false;
          $swal.fire({
            position: "center",
            title: "Success",
            text: deleted.value.message,
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
        admins.value = admins.value.filter(admin => admin.id !== selectedAdmin.value.id);
        modalDelete.value = false;
        selectedAdmin.value = null;
    };
</script>

<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Admin Management
      </div>
      <br>
     
      <!-- Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
        <!-- Summary Card #1 -->
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="clarity:administrator-solid"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ admins.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Admins
              </span>
            </div>
          </div>
        </rs-card>
      </div>
  
      <!-- List of admins -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Admins</div>
          <div class="flex justify-end items-center mb-3 gap-5">
            
            <rs-button variant="primary" @click="modalAdd = true">            
              <Icon name="solar:add-square-broken" class="mr-2" /> Add Admin
            </rs-button>
            <rs-modal title="Add Admin" v-model="modalAdd" size="lg" position="center"  :overlayClose="false">
              <template v-slot:header>
                Add Admin
              </template>
              <template v-slot:body>
                <form @submit.prevent="submitCategory">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="text" label="Username *" v-model="inputUsername" :class="{'border-red-500': errorUsername}" placeholder="Username"  />
                            <p v-if="errorUsername" class="text-red-500 text-sm">{{ errorUsername }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit :type="passwordVisible ? 'text' : 'password'" label="Password *" v-model="inputPassword" :class="{'border-red-500': errorPassword}" placeholder="Password"  >
                                <template #suffix>
                                    <button @click="togglePasswordVisibility" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-association items-association">
                                        <Icon v-if="passwordVisible" name="material-symbols:visibility" size="19"></Icon>
                                        <Icon v-else name="material-symbols:visibility-off" size="19"></Icon>                    
                                    </button>
                                </template>
                            </FormKit>
                            <p v-if="errorPassword" class="text-red-500 text-sm">{{ errorPassword }}</p>
                        </div>
                    </div>

                    <div class="mb-4">
                        <FormKit type="text" label="Name *" v-model="inputName" :class="{'border-red-500': errorName}" placeholder="Full Name"  />
                        <p v-if="errorName" class="text-red-500 text-sm">{{ errorName }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="email" label="Email *" v-model="inputEmail" :class="{'border-red-500': errorEmail}" placeholder="example@example.com"  />
                            <p v-if="errorEmail" class="text-red-500 text-sm">{{ errorEmail }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="text" label="Phone Num *" v-model="inputContact" :class="{'border-red-500': errorContact}" placeholder="0123654789"  />
                            <p v-if="errorContact" class="text-red-500 text-sm">{{ errorContact }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="select" label="Gender *" v-model="inputGender" :options="genders" :class="{'border-red-500': errorGender}" />
                            <p v-if="errorGender" class="text-red-500 text-sm">{{ errorGender }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="date" label="Date of birth *" v-model="inputDOB" :class="{'border-red-500': errorDOB}" placeholder="Date of Birth"  />
                            <p v-if="errorDOB" class="text-red-500 text-sm">{{ errorDOB }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="text" label="Line 1 *" v-model="inputLine1" :class="{'border-red-500': errorLine1}" placeholder="Line 1"  />
                            <p v-if="errorLine1" class="text-red-500 text-sm">{{ errorLine1 }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="text" label="Line 2" v-model="inputLine2" :class="{'border-red-500': errorLine2}" placeholder="Line 2"  />
                            <p v-if="errorLine2" class="text-red-500 text-sm">{{ errorLine2 }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="text" label="Postcode *" v-model="inputPostcode" :class="{'border-red-500': errorPostcode}" placeholder="Line 1"  />
                            <p v-if="errorPostcode" class="text-red-500 text-sm">{{ errorPostcode }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="text" label="City *" v-model="inputCity" :class="{'border-red-500': errorCity}" placeholder="City"  />
                            <p v-if="errorCity" class="text-red-500 text-sm">{{ errorCity }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="select" label="country *" v-model="inputCountry" :options="countries" :class="{'border-red-500': errorCountry}" />
                            <p v-if="errorCountry" class="text-red-500 text-sm">{{ errorCountry }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="select" label="State *" v-model="inputState" :options="states" :class="{'border-red-500': errorState}" />
                            <p v-if="errorState" class="text-red-500 text-sm">{{ errorState }}</p>
                        </div>
                    </div>
                  
                </form>
              </template>
              <template v-slot:footer>
                <rs-button @click="closeAdd">Cancel</rs-button>
                <rs-button @click="clickAdd">Add</rs-button>
              </template>
            </rs-modal>
          </div>
  
          <rs-table v-if="admins.length > 0"
            :data="admins"
            :options="{
              variant: 'default',
              striped: true,
              borderless: true,
            }"
            :field = "field"
            :options-advanced="{
              sortable: true,
              
              filterable: false,
            }"
            advanced
          >
          <template #name ="admins" >
                {{ admins.value.user.fullName}}
          </template>
          <template #email ="admins" >
                {{ admins.value.user.email}}
          </template>
          <template #contact ="admins" >
                {{ admins.value.user.phone}}
          </template>
          <template #status ="admins" >
                {{ admins.value.user.status}}
          </template>
            <template #action="admins">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(admins.value.id)"> 
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Edit
                </rs-button>
                <rs-modal title="Edit Admin" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Admin
                  </template>
                  <template v-slot:body>
                    <form @submit.prevent="submitCategory">
                    <div class="mb-4">
                        <FormKit type="text" label="Name *" v-model="inputName" :class="{'border-red-500': errorName}" placeholder="Full Name"  />
                        <p v-if="errorName" class="text-red-500 text-sm">{{ errorName }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="email" label="Email *" v-model="inputEmail" :class="{'border-red-500': errorEmail}" placeholder="example@example.com"  />
                            <p v-if="errorEmail" class="text-red-500 text-sm">{{ errorEmail }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="text" label="Phone Num *" v-model="inputContact" :class="{'border-red-500': errorContact}" placeholder="0123654789"  />
                            <p v-if="errorContact" class="text-red-500 text-sm">{{ errorContact }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="select" label="Gender *" v-model="inputGender" :options="genders" :class="{'border-red-500': errorGender}" />
                            <p v-if="errorGender" class="text-red-500 text-sm">{{ errorGender }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="date" label="Date of birth *" v-model="inputDOB" :class="{'border-red-500': errorDOB}" placeholder="Date of Birth"  />
                            <p v-if="errorDOB" class="text-red-500 text-sm">{{ errorDOB }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="text" label="Line 1 *" v-model="inputLine1" :class="{'border-red-500': errorLine1}" placeholder="Line 1"  />
                            <p v-if="errorLine1" class="text-red-500 text-sm">{{ errorLine1 }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="text" label="Line 2" v-model="inputLine2" :class="{'border-red-500': errorLine2}" placeholder="Line 2"  />
                            <p v-if="errorLine2" class="text-red-500 text-sm">{{ errorLine2 }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="text" label="Postcode *" v-model="inputPostcode" :class="{'border-red-500': errorPostcode}" placeholder="Line 1"  />
                            <p v-if="errorPostcode" class="text-red-500 text-sm">{{ errorPostcode }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="text" label="City *" v-model="inputCity" :class="{'border-red-500': errorCity}" placeholder="City"  />
                            <p v-if="errorCity" class="text-red-500 text-sm">{{ errorCity }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="mb-4">
                            <FormKit type="select" label="country *" v-model="inputCountry" :options="countries" :class="{'border-red-500': errorCountry}" />
                            <p v-if="errorCountry" class="text-red-500 text-sm">{{ errorCountry }}</p>
                        </div>
                        <div class="mb-4">
                            <FormKit type="select" label="State *" v-model="inputState" :options="states" :class="{'border-red-500': errorState}" />
                            <p v-if="errorState" class="text-red-500 text-sm">{{ errorState }}</p>
                        </div>
                    </div>                  
                </form>                    
                  </template>
                  <template v-slot:footer >
                    <rs-button @click="closeEdit">Cancel</rs-button>
                    <rs-button @click="clickUpdate">Update</rs-button>
                  </template>
                </rs-modal>
                <rs-button variant="danger" @click="confirmDelete(admins.value.id)">
                  <Icon
                    name="material-symbols:delete-sharp"
                    class="mr-2 !w-4 !h-4"
                  />
                  Delete
                </rs-button>
              </div>
            </template>
          </rs-table>
          <div v-else>
            No Data
          </div>
        </div>
      </div>
  
      <!-- Confirmation Modal -->
      <rs-modal title="Confirm Deletion" v-model="modalDelete" size="md" position="center" >
        <template v-slot:header>
          Confirm Deletion
        </template>
        <template v-slot:body>
          Are you sure you want to delete this admin?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeDelete">Cancel</rs-button>
          <rs-button @click="clickDelete">Delete</rs-button>
        </template>
      </rs-modal>
  
    </div>
</template>
  {{ admins }}

  
  <style lang="scss" scoped></style>
  

  