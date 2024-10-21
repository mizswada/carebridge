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
    const field =['name', 'description' ,'status','action'];
    
    const editInput = ref('');
    const nameInput = ref('');
    const descriptionInput = ref('');
    const statusInput = ref('');
    
    // list
    const admin = await useFetch('/api/admin/list');
    if(admin.data.value.response == 200)
    {
        admins.value = admin.data.value.data;
    }
    else
    {
        alert("An error occurred while fetching admins. Please try again.");
    }
    //add
    const closeAdd= () =>{
      modalAdd.value = false;
    };

    // clickAdd
    const clickAdd = async () => {
      try {
        const { data: add } = await useFetch("/api/admin/create", {
            method: "POST",
            body: JSON.stringify({  
              name:nameInput.value,
              description:descriptionInput.value,
              status:statusInput.value
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
      catch (error) 
      {
          console.error("Failed to created admin", error);
          alert("An error occurred while created admin details. Please try again.");
      }
    };

    // edit
    const editButton = async  (id) =>
    {       
        try {
            const { data: detail } = await useFetch("/api/admin/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });

            if (detail.value.response === 200) 
            {
                editInput.value= detail.value.data.admin_id;
                nameInput.value= detail.value.data.name;
                descriptionInput.value=detail.value.data.description;
                statusInput.value=detail.value.data.status;
                
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

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => {
      try {
        const { data: update } = await useFetch("/api/admin/update", {
            method: "POST",
            body: JSON.stringify({                  
              id: editInput.value,
              name:nameInput.value,
              description:descriptionInput.value,
              status:statusInput.value
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
                <form @submit.prevent="submitAdmin">
                  <FormKit type="text" label="Name" v-model="nameInput"/>
                  <FormKit type="textarea" v-model="descriptionInput" placeholder="Admin Details" rows="5" label="Details"/>
                  <FormKit 
                        type="select" 
                        label="Status"
                        v-model="statusInput" 
                        :options="[
                            { value: '', label: 'Please choose Status' },
                            { value: 'Enabled', label: 'Enabled' },
                            { value: 'Disabled', label: 'Disabled' }
                        ]"
                    />
                </form>
              </template>
              <template v-slot:footer>
                <rs-button @click="closeAdd">Cancel</rs-button>
                <rs-button @click="clickAdd">Add</rs-button>
              </template>
            </rs-modal>
          </div>
  
          <rs-table
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
                {{ admins.value.name}}
          </template>
          <template #description ="admins" >
                {{ admins.value.description}}
          </template>
          <template #status ="admins" >
                {{ admins.value.status}}
          </template>
            <template #action="admins">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(admins.value.admin_id)">
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
                    <form @submit.prevent="submitAdmin">
                      <FormKit type="text" label="Name" v-model="nameInput"/>
                      <FormKit type="textarea" v-model="descriptionInput" placeholder="Admin Details" rows="5" label="Details"/>
                      <FormKit 
                            type="select" 
                            label="Status"
                            v-model="statusInput" 
                            :options="[
                                { value: '', label: 'Please choose Status' },
                                { value: 'Enabled', label: 'Enabled' },
                                { value: 'Disabled', label: 'Disabled' }
                            ]"
                        />
                    </form>
                    
                  </template>
                  <template v-slot:footer >
                    <rs-button @click="closeEdit">Cancel</rs-button>
                    <rs-button @click="clickUpdate">Update</rs-button>
                  </template>
                </rs-modal>
                <rs-button variant="danger" @click="confirmDelete(admins.value.admin_id)">
                  <Icon
                    name="material-symbols:delete-sharp"
                    class="mr-2 !w-4 !h-4"
                  />
                  Delete
                </rs-button>
              </div>
            </template>
          </rs-table>
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
  

  
  <style lang="scss" scoped></style>
  

  