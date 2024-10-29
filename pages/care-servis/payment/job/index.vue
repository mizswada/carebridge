<script setup>
    definePageMeta({
        title: "Payment Management",
    });
    const { $swal, $router } = useNuxtApp();

    const modalEdit = ref(false);   
    const selectedId = ref(null);
    const job = ref(null);
    const sumPayment = ref(null);
    
    const field =['customerName',"jobTitle", 'amountPay' ,'paymentReferenceNum','paymentStatus','action'];
    
    const editInput = ref('');
    const custName = ref('');
    const custJobTitle = ref('');
    const custAmountPaid = ref('');
    const custReferenceNum = ref('');
    const custPaymentStatus = ref('');
    const statusOption=ref('');
    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    statusOption.value = lookupData.data.filter(item => item.lookupType === 'payment_status' && item.lookupID != 228).map(item => ({ value: item.lookupValue, label: item.lookupValue }));
    statusOption.value.unshift({ value: "", label: "Please choose" });
    // list
    const {data : jobs} = await useFetch('/api/care-service/job-payment/list');
    // alert(JSON.stringify(jobs.value));
    if(jobs.value.response == 200)
    {
        job.value = jobs.value.data.jobs;
        sumPayment.value=jobs.value.data.totalPayment;
    }
    else
    {
        alert("An error occurred while fetching job. Please try again.");
    }
    

    // edit
    const editButton = async  (id) =>
    {       
      selectedId.value=id;
      
        try {
            const { data: detail } = await useFetch("/api/care-service/job-payment/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });
            
            if (detail.value.response === 200) 
            {
              custName.value= detail.value.data.jobs.user.userFullName;
              custJobTitle.value=detail.value.data.jobs.job_title;
              custAmountPaid.value=detail.value.data.jobs.job_payment;                
              custReferenceNum.value=detail.value.data.jobs.job_paymentReferenceNum;                
              custPaymentStatus.value=detail.value.data.jobs.job_paymentStatus;  
              modalEdit.value = true;
            } 
            else 
            {
                alert("Payment not found.");
            }
        } 
        catch (error) 
        {
            console.error("Failed to fetch jobs details:", error);
            alert("An error occurred while fetching jobs details. Please try again.");
        }
    };

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => {
      try {
        const { data: update } = await useFetch("/api/care-service/job-payment/update", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedId.value,
              refNum:custReferenceNum.value,
              status:custPaymentStatus.value
            }),
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
            alert("Payment failed to update.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to updated jobs details:", error);
          alert("An error occurred while updated jobs details. Please try again.");
      }
    };
   
</script>

<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Payment Management
      </div>
      <br>
     
      <!-- Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-6">
        <!-- Summary Card #1 -->
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="arcticons:jobstreet"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ job.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Job 
              </span>
            </div>
          </div>
        </rs-card>

      <!-- Summary Card #2 -->
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-teal-100 rounded-2xl"
          >
            <Icon
              class="text-teal-500"
              name="material-symbols:list-alt-check"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ sumPayment }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Payment
            </span>
          </div>
        </div>
      </rs-card>
      </div>
  
      <!-- List of job -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Categories</div>    
          <rs-table
            :data="job"
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

          <template #customerName ="job" >
                {{ job.value.user.userFullName}}
          </template>
          <template #jobTitle ="job" >
                {{ job.value.job_title}}
          </template>
          <template #amountPay ="job" >
                {{ job.value.job_payment}}
          </template>
          <template #paymentReferenceNum ="job" >
                {{ job.value.job_paymentReferenceNum}}
          </template>
          <template #paymentStatus ="job" >
                {{ job.value.job_paymentStatus}}
          </template>
            <template #action="job">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(job.value.job_id)">
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Update Payment status
                </rs-button>
                <rs-modal title="Edit Payment" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Payment
                  </template>
                  <template v-slot:body>
                    <form @submit.prevent="submitPayment">
                      <FormKit type="text" label="Customer Name" v-model="custName" readonly/>
                      <FormKit type="text" label="Job Title" v-model="custJobTitle" readonly/>
                      <FormKit type="text" label="Amount Pay" v-model="custAmountPaid" readonly/>
                      <FormKit type="text" label="Payment Reference" v-model="custReferenceNum" />
                      <FormKit 
                            type="select" 
                            label="Status"
                            v-model="custPaymentStatus" 
                            :options="statusOption"
                        />
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
        </div>
      </div>
    </div>
</template>
  

  
  <style lang="scss" scoped></style>
  

  