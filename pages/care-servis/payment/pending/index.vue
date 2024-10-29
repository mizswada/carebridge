<script setup>
    definePageMeta({
        title: "Payment Management",
    });
    const { $swal, $router } = useNuxtApp();

    const modalEdit = ref(false);   
    const modalEditBulk = ref(false);   
    const selectedId = ref(null);
    const pending = ref(null);
    const sumPayment = ref(null);
    
    const field =['select','caretakeromerName',"jobTitle", 'amountPay' ,'accDetails','paymentStatus','action'];
    
    const editInput = ref('');
    const caretakerName = ref('');
    const caretakerJobTitle = ref('');
    const caretakerAmountPaid = ref('');
    const caretakerReferenceNum = ref('');
    const caretakerPaymentStatus = ref('');
    const caretakerPaymentStatusBulk = ref('');
    
    const statusOption=ref('');
    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    statusOption.value = lookupData.data.filter(item => item.lookupType === 'payment_status' && item.lookupID != 228).map(item => ({ value: item.lookupID, label: item.lookupValue }));
    statusOption.value.unshift({ value: "", label: "Please choose" });
    // list
    const {data : pendings} = await useFetch('/api/care-service/pending-payment/list');
    // alert(JSON.stringify(pendings.value));
    if(pendings.value.response == 200)
    {
        pending.value = pendings.value.data.assignments;
        sumPayment.value=pendings.value.data.totalJobPayment ;
    }
    else
    {
        alert("An error occurred while fetching pending. Please try again.");
    }
    
    
    
    // edit
    const editButton = async  (id) =>
    {       
      selectedId.value=id;      
        try {
            const { data: detail } = await useFetch("/api/care-service/pending-payment/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });
            
            if (detail.value.response === 200) 
            {
              caretakerName.value= detail.value.data[0].user.userFullName;
              caretakerJobTitle.value=detail.value.data[0].jobs.job_title;
              caretakerAmountPaid.value=detail.value.data[0].jobs.job_payment;                              
              caretakerPaymentStatus.value=detail.value.data[0].lookup_jobs_user_assignation_jobUser_paymentStatusTolookup?.lookupValue;  
              modalEdit.value = true;
            } 
            else 
            {
                alert("Payment not found.");
            }
        } 
        catch (error) 
        {
            console.error("Failed to fetch pendings details:", error);
            alert("An error occurred while fetching pendings details. Please try again.");
        }
    };

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => {
      try {
        const { data: update } = await useFetch("/api/care-service/pending-payment/update", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedId.value,
              refNum:caretakerReferenceNum.value,
              status:caretakerPaymentStatus.value
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
          console.error("Failed to updated pendings details:", error);
          alert("An error occurred while updated pendings details. Please try again.");
      }
    };

    const closeEditBulk= () =>{
      modalEditBulk.value = false;
    };

    const selectedItems = ref([]);
    // Bulk update function
    const clickBulkUpdate = async () => {
      if (selectedItems.value.length === 0) {
        alert("Please select at least one payment to update.");
        return;
      }
      modalEditBulk.value=true;            
    };

    const clickUpdateBulk = async () => {
        try {
          const { data: bulkUpdate } = await useFetch("/api/care-service/pending-payment/bulk-update", {
            method: "POST",
            body: JSON.stringify({
              ids: selectedItems.value,
              status: caretakerPaymentStatusBulk.value // Apply the same status to all selected items
            }),
          });
          // alert(JSON.stringify(bulkUpdate.value));
          if (bulkUpdate.value.response === 200) {
            $swal.fire({
              position: "center",
              title: "Success",
              text: bulkUpdate.value.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            setTimeout(() => { $router.go(); }, 1000);
          } else {
            $swal.fire({
              position: "center",
              title: "Fail",
              text: bulkUpdate.value.message,
              icon: "error",
              timer: 2000,
              showConfirmButton: true,
            });
          }
        } catch (error) {
          console.error("Failed to bulk update pendings details:", error);
          alert("An error occurred while bulk updating. Please try again.");
        }
    };
    const exportExcel = async () => {
        try {
            const response = await fetch('/api/care-service/pending-payment/export-excel', {
                method: 'GET',
            });
            const blob = await response.blob();

            // Create a download link for the file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'payment_data.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting Excel file:', error);
            $swal.fire({
            title: "Error",
            text: "An error occurred while exporting the Excel file.",
            icon: "error",
            });
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
                name="fluent:people-money-20-filled"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight"> {{ pending.length }}</span>
              <span class="text-base font-semibold text-gray-500">
                Total complete Job 
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
              Total Pending Payment
            </span>
          </div>
        </div>
      </rs-card>
      </div>
  
      <!-- List of pending -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Payment</div>  
          <div class="flex justify-end items-center mb-3 gap-5">
            <rs-button variant="primary" @click="exportExcel">
                <Icon name="solar:add-square-broken" class="mr-2" /> Export Excel
            </rs-button>
            <rs-button variant="secondary" @click="clickBulkUpdate">
              <Icon name="solar:pen-new-square-broken" class="mr-2" /> Update Selected
            </rs-button>
            
          </div>  
          <rs-table
            :data="pending"
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
          <template #select="pending">
            <input type="checkbox" :value="pending.value.jobUser_id" v-model="selectedItems" />
          </template>
          <template #caretakeromerName ="pending" >
                {{ pending.value.user.userFullName}}<br>
                {{ pending.value.user.userPhone}}
                
          </template>
          <template #jobTitle ="pending" >
                {{ pending.value.jobs.job_title}}
          </template>
          <template #amountPay ="pending" >
                {{ pending.value.jobs.job_payment}}
          </template>
          <template #accDetails ="pending" >
            <!-- {{ pending.value.user.user_care_taker.lookup_user_care_taker_bank_account_nameTolookup}}<br> -->
            {{ pending.value.user.user_care_taker[0].lookup_user_care_taker_bank_account_nameTolookup?.lookupValue}}<br>
            {{ pending.value.user.user_care_taker[0].bank_account_num}} <br>
            {{ pending.value.user.user_care_taker[0].bank_account_beneficiary}} <br>
          </template>
          <template #paymentStatus ="pending" >
                {{ pending.value.lookup_jobs_user_assignation_jobUser_paymentStatusTolookup?.lookupValue}}
          </template>
            <template #action="pending">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(pending.value.jobUser_id)">
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
                      <FormKit type="text" label="Customer Name" v-model="caretakerName" readonly/>
                      <FormKit type="text" label="Job Title" v-model="caretakerJobTitle" readonly/>
                      <FormKit type="text" label="Amount Pay" v-model="caretakerAmountPaid" readonly/>
                      <FormKit type="text" label="Payment Reference" v-model="caretakerReferenceNum" />
                      <FormKit 
                            type="select" 
                            label="Status"
                            v-model="caretakerPaymentStatus" 
                            :options="statusOption"
                        />
                    </form>
                    
                  </template>
                  <template v-slot:footer >
                    <rs-button @click="closeEdit">Cancel</rs-button>
                    <rs-button @click="clickUpdate">Update</rs-button>
                  </template>
                </rs-modal>

                <rs-modal title="Edit Payment" v-model="modalEditBulk" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Payment Bulk
                  </template>
                  <template v-slot:body>
                    <form @submit.prevent="submitPayment">                     
                      <FormKit 
                            type="select" 
                            label="Status"
                            v-model="caretakerPaymentStatusBulk" 
                            :options="statusOption"
                        />
                    </form>
                    
                  </template>
                  <template v-slot:footer >
                    <rs-button @click="closeEditBulk">Cancel</rs-button>
                    <rs-button @click="clickUpdateBulk">Update</rs-button>
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
  

  