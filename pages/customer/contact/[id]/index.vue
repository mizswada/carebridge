<script setup>
    definePageMeta({
        title: "Contact Management",
    });
    const { $swal, $router } = useNuxtApp();
    const id = useRoute().params.id;

    const modalEdit = ref(false);
    const modalAdd = ref(false);
    const modalDelete = ref(false);
    const selectedContact = ref(null);
    const contacts = ref(null);
    const field =['Name' ,'relationship','contact', 'createdAt','action'];
   
    const contactName = ref('');
    const contactPhone=ref('');
    const contactRelationship= ref('');    

    const contactNameError = ref('');
    const contactPhoneError = ref('');
    const contactRelationshipError = ref('');


    // list
    const contact = await useFetch("/api/customer/contact/list", {
        method: "GET",
        query: {
            id: parseInt(id),
        },
    });
    // alert(JSON.stringify(contact.data.value));
    // const contact = await useFetch('/api/customer/contact/list');
    if(contact.data.value.response == 200)
    {
        contacts.value = contact.data.value.data.contacts;
    }
    else
    {
        alert("An error occurred while fetching contacts. Please try again.");
    }
    //add

    const openAdd = () =>{
        modalAdd.value=true;
        contactName.value= null;
        contactPhone.value = null;
        contactRelationship.value=null;
    };

    const closeAdd= () =>{
      modalAdd.value = false;
    };

    const validateFields = () => 
    {
        let isValid = true;
        // Reset errors
        
        contactNameError.value = '';
        contactPhoneError.value='';
        contactRelationshipError.value = '';

        
        if (!contactName.value) {
            contactNameError.value = 'Name is required';
            isValid = false;
        }
        if (!contactPhone.value) {
            contactPhoneError.value = 'Contact is required';
            isValid = false;
        }

        if (!contactRelationship.value) {
            contactRelationshipError.value = 'Status is required';
            isValid = false;
        }

        return isValid;
    };

    // clickAdd
    const clickAdd = async () => 
    {
        if (!validateFields()) {
            return; // Stop if form is invalid
        }

        try {
          
          const { data: add } = await useFetch("/api/customer/contact/create", {
              method: "POST",
              body: JSON.stringify({  
                  user_id : id,
                  contactName:contactName.value,
                  contactPhone:contactPhone.value,
                  contactRelationship:contactRelationship.value,
              }),
          });        
          // alert(JSON.stringify(add.value));
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
              alert("Contact failed to create.");
          }
             
        } 
        catch (error) 
        {
            console.error("Failed to created contact", error);
            alert("An error occurred while created contact details. Please try again.");
        }
    };

    // edit
    const editButton = async  (id) =>
    {       
      selectedContact.value=id;
        try {
            const { data: detail } = await useFetch("/api/customer/contact/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });
            // alert(JSON.stringify(detail.value.data));
            if (detail.value.response === 200) 
            {
                contactName.value=detail.value.data.contact_name;
                contactPhone.value=detail.value.data.contact_phone_number;
                contactRelationship.value=detail.value.data.contact_relationship;
                modalEdit.value = true;
            } 
            else 
            {
                alert("Contact not found.");
            }
        } 
        catch (error) 
        {
            console.error("Failed to fetch contact details: 1", error);
            alert("An error occurred while fetching contact details. Please try again.");
        }
    };

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => 
    {
        try {
          if (!validateFields()) {
            return; // Stop if form is invalid
          }

          const { data: update } = await useFetch("/api/customer/contact/update", {
              method: "POST",
              body: JSON.stringify({  
                  id : selectedContact.value,
                  contactName:contactName.value,
                  contactPhone:contactPhone.value,
                  contactRelationship:contactRelationship.value
              })
          });  
          // alert(JSON.stringify(update.value));
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
              alert("Contact failed to update.");
          }
            
        } 
        catch (error) {
            console.error("Failed to updated contact details:", error);
            alert("An error occurred while updated contact details. Please try again.");
        }
    };

    //delete
    const closeDelete= () =>{
      modalDelete.value = false;
    };
    
    const confirmDelete = (id) => {
        selectedContact.value = id;
        modalDelete.value = true;
    };
    
    const clickDelete = async () => 
    {
      try {
        const { data:deleted} = await useFetch("/api/customer/contact/delete", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedContact.value,
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
            alert("Contact failed to update.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to updated contact details:", error);
          alert("An error occurred while updated contact details. Please try again.");
      }
        contacts.value = contacts.value.filter(contact => contact.id !== selectedContact.value.id);
        modalDelete.value = false;
        selectedContact.value = null;
    };

    const relationshipOption = ref([]);
    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    relationshipOption.value = lookupData.data.filter(item => item.lookupType == 'contact_relationship').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    relationshipOption.value.unshift({ value: "", label: "Please choose" });

  
    
    // Function to format date to dd-mm-yyyy hh:mm:ss
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
      return `${day}-${month}-${year}`;
    };
</script>

<template>
  
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Contact Management
      </div>
      <br>
      <!-- Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-6">
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-blue-100 rounded-2xl"
            >
              <Icon
                class="text-blue-500"
                name="material-symbols:shield-with-house-rounded"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ contact.data.value.data.user.userFullName }}</span>
              <span class="text-base font-semibold text-gray-500">
                customer Name
              </span>
            </div>
          </div>
        </rs-card>

        <!-- Summary Card #1 -->
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="material-symbols:add-photo-alternate-sharp"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ contacts.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total contact
              </span>
            </div>
          </div>
        </rs-card>
      </div>
      <!-- List of contacts -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Contacts </div>
          <div class="flex justify-end items-center mb-3 gap-5" v-if="contacts.length <5">
            
            <rs-button variant="primary" @click="openAdd">            
              <Icon name="solar:add-square-broken" class="mr-2" /> Add Contact
            </rs-button>
            <rs-modal title="Add Contact" v-model="modalAdd" size="lg" position="center" :overlayClose="false">
                <template v-slot:header>
                Add Contact
                </template>
                <template v-slot:body>
                  <form>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Name Input -->
                    <div class="mb-4">
                        <FormKit type="text" label="Name" v-model="contactName" :class="{'border-red-500': contactNameError}" placeholder="Name" />
                        <p v-if="contactNameError" class="text-red-500 text-sm">{{ contactNameError }}</p>
                    </div>

                    <!-- Phone Input -->
                    <div class="mb-4">
                        <FormKit type="text" label="Contact" v-model="contactPhone" :class="{'border-red-500': contactPhoneError}" maxlength="11" placeholder="0123654789" />
                        <p v-if="contactPhoneError" class="text-red-500 text-sm">{{ contactPhoneError }}</p>
                    </div>
                    </div>

                    <!-- Status Dropdown -->
                    <div class="mb-4">
                    <FormKit type="select" label="Relationship *" v-model="contactRelationship" :class="{'border-red-500': contactRelationshipError}" :options="relationshipOption" required />
                    <p v-if="contactRelationshipError" class="text-red-500 text-sm">{{ contactRelationshipError }}</p>
                    </div>
                  </form>
                </template>
                <template v-slot:footer>
                <rs-button @click="closeAdd">Cancel</rs-button>
                <rs-button @click="clickAdd">Add</rs-button>
                </template>
            </rs-modal>
          </div>
  
          <rs-table v-if="contacts.length > 0"
            :data="contacts"
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
          <template #Name ="contacts" >
                {{ contacts.value.contact_name}}
          </template>
          <template #relationship ="contacts" >
                {{ contacts.value.lookup.lookupValue}}
          </template>
          <template #contact ="contacts" >
                {{ contacts.value.contact_phone_number}}
          </template>
         
          <template #createdAt ="contacts" >
                {{ formatDate(contacts.value.created_at)}}
          </template>
            <template #action="contacts">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(contacts.value.contact_id)">
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Edit
                </rs-button>
                <rs-modal title="Edit Contact" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Contact
                  </template>
                  <template v-slot:body>
                    <form>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Name Input -->
                        <div class="mb-4">
                            <FormKit type="text" label="Name" v-model="contactName" :class="{'border-red-500': contactNameError}" placeholder="Name" />
                            <p v-if="contactNameError" class="text-red-500 text-sm">{{ contactNameError }}</p>
                        </div>

                        <!-- Phone Input -->
                        <div class="mb-4">
                            <FormKit type="text" label="Contact" v-model="contactPhone" :class="{'border-red-500': contactPhoneError}" placeholder="Contact" />
                            <p v-if="contactPhoneError" class="text-red-500 text-sm">{{ contactPhoneError }}</p>
                        </div>
                      </div>

                      <!-- Status Dropdown -->
                      <div class="mb-4">
                        <FormKit type="select" label="Relationship *" v-model="contactRelationship" :class="{'border-red-500': contactRelationshipError}" :options="relationshipOption" required />
                        <p v-if="contactRelationshipError" class="text-red-500 text-sm">{{ contactRelationshipError }}</p>
                      </div>
                  </form>
                  </template>
                  <template v-slot:footer >
                    <rs-button @click="closeEdit">Cancel</rs-button>
                    <rs-button @click="clickUpdate">Update</rs-button>
                  </template>
                </rs-modal>
                <rs-button variant="danger" @click="confirmDelete(contacts.value.contact_id)">
                  <Icon
                    name="material-symbols:delete-sharp"
                    class="mr-2 !w-4 !h-4"
                  />
                  Delete
                </rs-button>
              </div>
            </template>
          </rs-table>
          <div v-else> No data</div>
        </div>
      </div>
  
      <!-- Confirmation Modal -->
      <rs-modal title="Confirm Deletion" v-model="modalDelete" size="md" position="center" >
        <template v-slot:header>
          Confirm Deletion
        </template>
        <template v-slot:body>
          Are you sure you want to delete this contact?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeDelete">Cancel</rs-button>
          <rs-button @click="clickDelete">Delete</rs-button>
        </template>
      </rs-modal>
  
    </div>
</template>
  

  
<style lang="scss" scoped>
.text-red-500 {
  color: #f56565;
}
.text-sm {
  font-size: 0.875rem;
}
</style>

  