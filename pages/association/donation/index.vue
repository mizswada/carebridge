<script setup>
    definePageMeta({
        title: "Donation Management",
    });
    const { $swal, $router } = useNuxtApp();
    import { useUserStore } from "~/stores/user";
    const userStore = useUserStore();
    const id = userStore.userId;
    const modalDelete = ref(false);

    const modalEdit = ref(false);
    const selectedDonation = ref(null);
    const donations = ref(null);

    const userOptions= ref([]);
    const donation_user_id= ref(null);
    const donation_association_id= ref(null);
    const donation_amount= ref(null);
    const donation_date= ref(null);
    const donation_status= ref(null);
    const donation_reference_number= ref(null);
    const statusOptions=ref(null);
    const field =['donor', 'amount' ,'reference','date','status','action'];

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

    

    const lookupData = await $fetch('/api/lookup', {
        method: 'GET'
    });
    statusOptions.value = lookupData.data.filter(item => item.lookupType == 'donation_status').map(item => ({ value: item.lookupID, label: item.lookupValue }));
    statusOptions.value.unshift({ value: "", label: "Please choose" });

    const userData = await $fetch('/api/userList', {
        method: 'GET'
    });
    userOptions.value = userData.data.filter(item => item.userStatus == 'ACTIVE').map(item => ({ value: item.userID, label: item.userFullName }));
    userOptions.value.unshift({ value: "", label: "Please choose" });
    // list
    const donation = await useFetch("/api/association/donation/list", {
        method: "GET",
        query: {
          id: userStore.username,
        },
    });
    // alert(JSON.stringify(donation.data.value));
    // const donation = await useFetch('/api/association/donation/list');
    if(donation.data.value.response == 200)
    {
        donations.value = donation.data.value.data.donations;
    }
    else
    {
        alert("An error occurred while fetching donations. Please try again.");
    }
    // edit
    const editButton = async  (id) =>
    {      
      selectedDonation.value=id;
        try {
            const { data: detail } = await useFetch("/api/association/donation/get", {
                method: "GET",
                query: {
                    id: parseInt(id),
                },
            });
            // alert(JSON.stringify(detail.value));
            if (detail.value.response === 200) 
            {
              donation_user_id.value= detail.value.data.donation_user_id;
              donation_association_id.value= detail.value.data.donation_association_id;
              donation_amount.value=detail.value.data.donation_amount;
              donation_date.value=formatDate(detail.value.data.donation_date);
              donation_status.value=detail.value.data.donation_status;
              donation_reference_number.value=detail.value.data.donation_reference_number;
                
              modalEdit.value = true;
            } 
            else 
            {
                alert("Donation not found.");
            }
        } 
        catch (error) 
        {
            console.error("Failed to fetch donation details:", error);
            alert("An error occurred while fetching donation details. Please try again.");
        }
    };

    const closeEdit= () =>{
      modalEdit.value = false;
    };
    
    const clickUpdate = async () => {
      try {
        const { data: update } = await useFetch("/api/association/donation/update", {
            method: "POST",
            body: JSON.stringify({                  
              id: selectedDonation.value,
              status:donation_status.value
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
            alert("Donation failed to update.");
        }
      } 
      catch (error) 
      {
          console.error("Failed to updated donation details:", error);
          alert("An error occurred while updated donation details. Please try again.");
      }
    };   
   
</script>

<template>
    <div class="space-y-8">
      <div class="text-lg font-semibold">
        Donation Management
      </div>
      <br>
     
      <!-- Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-6">
        <!-- Summary Card #1 -->
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
              <span class="block font-semibold text-xl leading-tight"> {{ donation.data.value.data.user.userFullName }}</span>
              <span class="text-base font-semibold text-gray-500">
                Association Name
              </span>
            </div>
          </div>
        </rs-card>
        <rs-card>
          <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
            <div
              class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
            >
              <Icon
                class="text-indigo-500"
                name="solar:hand-money-outline"
              ></Icon>
            </div>
            <div class="flex-1 truncate">
              <span class="block font-semibold text-xl leading-tight">RM {{ donation.data.value.data.donationSum}}</span>
              <span class="text-base font-semibold text-gray-500">
                Total Donation
              </span>
            </div>
          </div>
        </rs-card>
      </div>
      <!-- List of donations -->
      <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Donation</div>
          <div class="flex justify-end items-center mb-3 gap-5"></div>
  
          <rs-table v-if="donations.length > 0"
            :data="donations"
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
            <!-- 'donor', 'amount' ,'reference','date','status','action' -->
            <template #donor ="donations" >
                  {{ donations.value.user_donation_donation_user_idTouser.userUsername}}
            </template>
            <template #amount ="donations" >
                  {{ donations.value.donation_amount}}
            </template>
            <template #reference ="donations" >
                  {{ donations.value.donation_reference_number}}
            </template>
            <template #date ="donations" >
                  {{ formatDate(donations.value.created_at)}}
            </template>
            <template #status ="donations" >
                  {{ donations.value.lookup.lookupValue}}
            </template>
            <template #action="donations">
              <div class="flex items-center gap-4">
                <rs-button @click="editButton(donations.value.donation_id)">
                  <Icon
                    name="solar:pen-new-square-broken"
                    class="mr-2 !w-4 !h-4"
                  />
                  Edit
                </rs-button>
                <rs-modal title="Edit Donation" v-model="modalEdit" position="center" size="lg"  :overlayClose="false">
                  <template v-slot:header>
                    Edit Donation
                  </template>
                  <template v-slot:body>
                    <form>
                      <FormKit  type="select" label="User" v-model="donation_user_id"  :options="userOptions" disabled />
                      <FormKit type="text" label="Amount" v-model="donation_amount" disabled/>
                      <FormKit type="text" label="Reference" v-model="donation_reference_number" disabled/>
                      <FormKit type="text" label="Date Donation" v-model="donation_date" disabled/>
                      <FormKit type="select"  label="Status" v-model="donation_status"  :options="statusOptions" />
                        
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
          <div v-else> No data</div>
        </div>
      </div>
  
      <!-- Confirmation Modal -->
      <rs-modal title="Confirm Deletion" v-model="modalDelete" size="md" position="center" >
        <template v-slot:header>
          Confirm Deletion
        </template>
        <template v-slot:body>
          Are you sure you want to delete this donation?
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

  