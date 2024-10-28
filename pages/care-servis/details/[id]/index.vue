<script setup>  
      definePageMeta({
        title: "View Details ",
    });
    const id = useRoute().params.id;
    const job=ref([]);
    const jobDetails=ref([]);
    const careservice=ref([]);
    const caretaker=ref([]);
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      
      // Extract day, month, year, hours, minutes, and seconds
      const day = String(date.getDate()).padStart(2, "0");      // Ensure 2 digits for day
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month (months are 0-indexed)
      const year = date.getFullYear();                           // Full year

      // Return the formatted string
      return `${day}-${month}-${year}`;
    };
    const { data: detail } = await useFetch("/api/care-service/details/get", {
        method: "GET",
        query: {
            id: parseInt(id),
        },
    });
   
    if (detail.value.response === 200)
    {
        // alert(JSON.stringify(detail.value));
        job.value=detail.value.data.job;
        jobDetails.value=detail.value.data.jobDetail;
        careservice.value=detail.value.data.careservice;
        caretaker.value=detail.value.data.caretaker;
    }
 
  
  // Calculate Subtotal
  const subtotal = computed(() => {
    return invoiceItems.value.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  });
  
  // Calculate Tax Amount
  const taxAmount = computed(() => {
    return (subtotal.value * taxRate.value) / 100;
  });
  
  // Calculate Total
  const total = computed(() => {
    return subtotal.value + taxAmount.value;
  });
  
  // Currency Formatting Helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MYR',
    }).format(value);
  };
</script>


<template>
    <div class="p-6 bg-white border border-gray-200 shadow-lg max-w-7xl mx-auto">
      <!-- Invoice Header -->
      <div class="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 class="text-2xl font-bold"></h2>
          <p class="text-gray-500"></p>
          <p class="text-gray-500">Date: {{ formatDate(job.job_date) }}</p>
        </div>
        <div class="text-right">
          <p class="text-xl font-semibold uppercase">{{ careservice.userFullName }}</p>
          <p>{{ careservice.userPhone }}</p>
          <p>{{ careservice.userEmail }}</p>
        </div>
      </div>
  
      <!-- Client Details -->
      <div class="mb-6">
        <p class="font-semibold">Bill To:</p>
        <p v-if="detail.data.jobDetailCount == 0">No Caretaker Assign</p>
        <p v-if="detail.data.jobDetailCount > 0">{{ caretaker.userFullName }}</p>
        <p v-if="detail.data.jobDetailCount > 0">{{ caretaker.userEmail }}</p>
        <p v-if="detail.data.jobDetailCount > 0">{{ caretaker.userPhone }}</p>
      </div>
  
      <!-- Invoice Table -->
      <table class="w-full table-auto mb-6">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left">Description</th>
            <th class="px-4 py-2 text-left">Hour</th>
            <th class="px-4 py-2 text-right">Charges(RM)</th>
            <th class="px-4 py-2 text-right">Total(RM)</th>
          </tr>
        </thead>
        <tbody>
          
          <tr class="border-b">
            <td class="px-4 py-2">{{ job.job_title }} ({{ job.category.name }}) </td>
            <td class="px-4 py-2">{{ job.job_duration }}</td>
            <td class="px-4 py-2 text-right">{{ job.category.charges }}</td>
            <td class="px-4 py-2 text-right">{{ job.category.charges*job.job_duration }}</td>
          </tr>
          <tr class="border-b" v-if="job.job_additionalCare == 65">
            <td class="px-4 py-2">
              *Additional Care:<br>
              bathing and dressing, change diapers, bedridden or wheel chair use,
              dementia, diabetic carebathing <br>and dressing, change diapers, bedridden 
              or wheel chair use, dementia, diabetic care
            </td>
            <td class="px-4 py-2">{{ job.job_duration }}</td>
            <td class="px-4 py-2 text-right"> 5 </td>
            <td class="px-4 py-2 text-right">{{ 5 * job.job_duration }}</td>
          </tr>
          <tr class="border-b" v-if="job.job_additionalCare == 65">
            <td class="px-4 py-2" colspan="4" >
              Location :
              {{ job.job_location_city }} {{ job.lookup_jobs_job_location_stateTolookup.lookupValue }} <br>
              Notes: {{ job.job_notes }}

            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Totals -->
      <div class="flex justify-end mb-4">
        <div class="w-1/2">
          <div class="flex justify-between py-2">
            <p class="text-gray-600">Subtotal:</p>
            <p>{{ (job.category.charges*job.job_duration) + (5 * job.job_duration)}}</p>
          </div>
          <!-- <div class="flex justify-between py-2">
            <p class="text-gray-600">Tax ({{ taxRate }}%):</p>
            <p>{{ formatCurrency(taxAmount) }}</p>
          </div> -->
          <div class="flex justify-between py-2 font-semibold">
            <p>Total:</p>
            <p>{{ (job.category.charges*job.job_duration) + (5 * job.job_duration)}}</p>
          </div>
        </div>
      </div>
  
      <!-- Footer -->
      <div class="text-center text-gray-500 mt-6">
        <p>Thank you for your business!</p>
        <!-- <p>If you have any questions about this invoice, please contact us at {{ companyEmail }}.</p> -->
      </div>
    </div>
</template>
  

  
<style scoped>
  /* Custom styles can be added here */
</style>
  