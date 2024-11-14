<script setup>
    definePageMeta({
        title: "Caretaker Management",
    });
    
    const caretakers = ref(null);
    const states = ref([]);
    const countries = ref([]);
    const genders = ref([]);
    const field =['name', 'email' ,'contact','status','action'];


    const jobs = ref([]);

    // list
    const caretaker = await useFetch('/api/caretaker/pending/list');
    // alert(JSON.stringify(caretaker.data.value));
    if(caretaker.data.value.response == 200){
        caretakers.value = caretaker.data.value.data.user;
        jobs.value=caretaker.data.value.data.jobs;
    }
    else{
        alert("An error occurred while fetching caretakers. Please try again.");
    }

</script>

<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Caretaker Management
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
                name="hugeicons:healtcare"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ caretakers.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Pending Approval Caretakers
              </span>
            </div>
          </div>
        </rs-card>
      </div>
  
      <!-- List of caretakers -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Caretakers</div>
          <div class="flex justify-end items-center mb-3 gap-5">
            
          </div>
  
          <rs-table v-if="caretakers.length > 0"
            :data="caretakers"
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
          <template #name ="caretakers" >
                {{ caretakers.value.fullName}}
          </template>
          <template #email ="caretakers" >
                {{ caretakers.value.email}}
          </template>
          <template #contact ="caretakers" >
                {{ caretakers.value.phone}}
          </template>
          <template #status ="caretakers" >
                {{ caretakers.value.status}}
          </template>
            <template #action="caretakers">
              <div class="flex items-center gap-4">
                <nuxt-link :to="`/caretaker/pending/detail/`+caretakers.value.id">
                  <rs-button >
                    <Icon
                      name="material-symbols:visibility"
                      class="mr-2 !w-4 !h-4"
                    />
                    view
                  </rs-button>
                </nuxt-link>
                <!-- <rs-button @click="editButton(caretakers.value.id)">
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Edit
                </rs-button> -->
                <rs-modal title="Edit Caretaker" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Caretaker
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
          Are you sure you want to delete this caretaker?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeDelete">Cancel</rs-button>
          <rs-button @click="clickDelete">Delete</rs-button>
        </template>
      </rs-modal>
  
    </div>
</template>

  
  <style lang="scss" scoped></style>
  

  