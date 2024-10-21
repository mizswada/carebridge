<script setup>
    definePageMeta({
        title: "List ",
    });
    const { $swal, $router } = useNuxtApp();
    const showDeleteModal = ref(false);
    const selectedCenter = ref(null);
    const field =['name', 'contact','address' ,'status','action'];
    
    
    const rehabList = ref(null);
    // const rehabCenters = ref([]);
    // list
    const rehab = await useFetch('/api/rehab-center/list');
    if(rehab.data.value.response == 200)
    {
      rehabList.value = rehab.data.value.data;
    }
    else
    {
        alert("An error occurred while fetching categories. Please try again.");
    }

    const closeDelete= () =>{
      showDeleteModal.value = false;
    };
       
    const confirmDelete = (center) => {
        selectedCenter.value = center;
        showDeleteModal.value = true;
    };
    
    const clickDelete = async () => 
    {
      try {
        const { data:deleted} = await useFetch("/api/rehab-center/delete", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedCenter.value,
            }),
        });        

        if (deleted.value.response === 200) 
        {
          showDeleteModal.value = false;
          $swal.fire({
            position: "center",
            title: "Success",
            text: deleted.value.message,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          setTimeout(() => {
            $router.go();
          }, 1000);
        } 
        else 
        {
            alert("User failed to deleted.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to deleted user details:", error);
          alert("An error occurred while deleted user details. Please try again.");
      }
    };
</script>

<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Rehab Center
      </div>
      <!-- First Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
        <!-- Summary Card #1 -->
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="material-symbols:family-home"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight">{{ rehabList.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Rehab Center
              </span>
            </div>
          </div>
        </rs-card>
      </div>

      <!-- List of rehab centers -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Rehab Center</div>
          <div class="flex justify-end items-center mb-3 gap-5">
            <nuxt-link :to="`/rehab-center/list/create`">
                <rs-button variant="primary">
                    <Icon name="solar:add-square-broken" class="mr-2" /> Add Rehab Center             
                </rs-button>
            </nuxt-link>
            <!-- <rs-button variant="primary" @click="showModal2 = true">            
              <Icon name="solar:add-square-broken" class="mr-2" /> Add Rehab Center
            </rs-button>
            <rs-modal title="Add Rehab Center"  v-model="showModal2"  size="lg" cancel-title="Close" ok-title="Save">
                        <template v-slot:header>
                          Add Rehab Center
                        </template>
                        <template v-slot:body>
                          <form @submit.prevent="submitRehabCenter">
                            <FormKit type="text" label="Name"/>
                            
                            <FormKit type="textarea" placeholder="Center Details" rows="5" label="Details"/>
  
                            <FormKit
                              type="select"
                              label="Category"
                              :options="optionsCategory"
                            />
                          </form>
                        </template>
                        
            </rs-modal>   -->
            
            </div>
              <rs-table
                    :data="rehabList"
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
                  <template #name ="rehabList" >
                      {{ rehabList.value.user.username}} <br>
                      {{ rehabList.value.user.fullName}}
                  </template>
                  <template #contact ="rehabList" >
                      {{ rehabList.value.user.email}}<br>
                      {{ rehabList.value.user.phone}}
                  </template>
                  <template #address ="rehabList" >
                        {{ rehabList.value.address.line1}}
                        {{ rehabList.value.address.line2}}
                        {{ rehabList.value.address.city}}<br>
                        {{ rehabList.value.address.postcode}}
                        {{ rehabList.value.address.state}}
                        {{ rehabList.value.address.country}}
                  </template>
                  <template #status ="rehabList" >
                        {{ rehabList.value.user.status}}
                  </template>
                  <template #action ="rehabList" >
                    <div class="flex items-center gap-4">
                      <nuxt-link :to="`/rehab-center/list/view/`+rehabList.value.id">
                        <rs-button >
                          <Icon
                            name="material-symbols:visibility"
                            class="mr-2 !w-4 !h-4"
                          />
                          view
                        </rs-button>
                      </nuxt-link>
                      <!-- <nuxt-link :to="`/rehab-center/list/activity/`+rehabList.value.id">
                        <rs-button variant="info">
                              <Icon name="material-symbols:list-alt-outline-rounded" class="mr-2 !w-4 !h-4" /> Activity             
                          </rs-button>
                      </nuxt-link> -->
                      <rs-button variant="danger" @click="confirmDelete(rehabList.value.id)">
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
      <rs-modal title="Confirm Deletion" v-model="showDeleteModal" size="md" position="center" >
        <template v-slot:header>
          Confirm Deletion
        </template>
        <template v-slot:body>
          Are you sure you want to delete this rehab center?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeDelete">Cancel</rs-button>
          <rs-button @click="clickDelete">Delete</rs-button>
        </template>
      </rs-modal>
  
    </div>
</template>

<style lang="scss" scoped></style>
  