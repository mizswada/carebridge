<script setup>  
  // Page Meta
  definePageMeta({
    title: 'Job List',
    layout: 'default',
    middleware: ['auth'], // Assuming auth middleware is required
  });
  
  // Reactive variable to store job data
  const jobs = ref([]);
  const jobRespond = ref([]);
  
  const userId = useRoute().params.id;
  const field = ["title","category", "city", "state", "date","status","amount"];
  const name =ref('');
  const count =ref(0);
  const fetchJobs = async () => {
    try {
        jobRespond.value = await useFetch("/api/customer/jobs/list", {
            method: "GET",
            query: {
                id: parseInt(userId),
            },
            
        });

        jobs.value=jobRespond.value.data.data.jobs;
        name.value=jobRespond.value.data.data.user.userFullName;
        count.value=jobRespond.value.data.data.totalPayment;
        // alert(JSON.stringify(jobRespond.value));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };
  
  // Fetch jobs when the component is mounted
  onMounted(() => {
    fetchJobs();
  });
  
  // Helper functions to format dates and job status
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  };
  
  
</script>
<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Job Management
      </div>
      <!-- Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
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
              <span class="block font-semibold text-xl leading-tight">{{ name }} </span>
              <span class="text-base font-semibold text-gray-500">
                customer Name
              </span>
            </div>
          </div>
        </rs-card>

        <!-- Summary  -->
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="fluent:tasks-app-20-filled"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight">{{ jobs.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Jobs
              </span>
            </div>
          </div>
        </rs-card>

        <!-- Summary  -->
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="fluent:person-money-24-filled"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight">RM {{ count }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Pending Payment 
              </span>
            </div>
          </div>
        </rs-card>
      </div>
      <!-- List of jobs -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Jobs </div>  
          <rs-table v-if="jobs.length > 0"
            :data="jobs"
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
          <template #title ="jobs" >
                {{ jobs.value.job_title}}
          </template>
          <template #category ="jobs" >
                {{ jobs.value.category.name}}
          </template>
          <template #state ="jobs" >
                {{ jobs.value.lookup_jobs_job_location_stateTolookup.lookupValue}}
          </template>
          <template #date ="jobs" >
                {{ jobs.value.job_date}}
          </template>
          <template #status ="jobs" >
                {{ jobs.value.lookup_jobs_job_location_stateTolookup.lookupValue}}
          </template>
          <template #createdAt ="jobs" >
                {{ formatDate(jobs.value.created_at)}}
          </template>
          <template #amount ="jobs" >
                RM {{jobs.value.job_payment}}
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
          Are you sure you want to delete this equipment?
        </template>
        <template v-slot:footer>
          <rs-button @click="closeDelete">Cancel</rs-button>
          <rs-button @click="clickDelete">Delete</rs-button>
        </template>
      </rs-modal>
  
    </div>
</template>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  </style>
  