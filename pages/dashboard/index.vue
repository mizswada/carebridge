<script setup>
  definePageMeta({
    title: "Dashboard",
    middleware: ["auth"],
    requiresAuth: true,
  });
  import { useUserStore } from "~/stores/user";
  const userStore = useUserStore();
  const id = userStore.userId;
  const roles = userStore.roles;

  const totAssociation=ref(0);
  const totRehab=ref(0);
  const totCustomer=ref(0);
  const totCaretaker=ref(0);
  const totJob=ref(0);
  const totJobComplete=ref(0);
  const totPendingPayment=ref(0);
  const totRefundPayment=ref(0);
  const monthlyPayment=ref(0);
  const monthlyJobPayment=ref(0);
  const associationList=ref([]);
  const jobList=ref([]);
  const associationDonation=ref([]);
  const donationList=ref([]);

  const rehabActivity=ref(0);
  const rehabAds=ref(0);
  const rehabEquipment=ref(0);
  const equipments=ref(0);
  const field =['Name' ,'type','PIC','status', 'createdAt'];


  const asssociationActivity=ref(0);
  const asssociationDonation=ref(0);
  const asssociationEquipment=ref(0);
  const field2 =['donor', 'amount' ,'reference','date','status'];

  const donations=ref(0);

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

  const {data:dashboardData} = await useFetch('/api/dashboard');
  // alert(JSON.stringify(dashboardData.value));
  if(dashboardData.value.response == 200)
  {
    if(useUserStore().roles.includes('Superadmin') || useUserStore().roles.includes('Admin'))
    {
      totAssociation.value=dashboardData.value.data.associations;
      totRehab.value=dashboardData.value.data.rehab;
      totCustomer.value=dashboardData.value.data.caretaker;
      totCaretaker.value=dashboardData.value.data.customer;
      totJob.value=dashboardData.value.data.job;
      totJobComplete.value=dashboardData.value.data.completedJob;
      totPendingPayment.value=dashboardData.value.data.pendingPayment;
      totRefundPayment.value=dashboardData.value.data.refundPayment;
      monthlyPayment.value=dashboardData.value.data.monthlyPayment;
      monthlyJobPayment.value=dashboardData.value.data.monthlyJobPayment;
      associationList.value=dashboardData.value.data.associationList;
      associationDonation.value=dashboardData.value.data.donationPercentages;
      jobList.value=dashboardData.value.data.jobList;
      donationList.value=dashboardData.value.data.donationList;
    }
    else if(useUserStore().roles.includes('Rehab center'))
    {      
      rehabActivity.value=dashboardData.value.data.activityCount;
      rehabAds.value=dashboardData.value.data.adsCount;
      rehabEquipment.value=dashboardData.value.data.equipmentCount;
      equipments.value=dashboardData.value.data.equipmentList;
    }
    else if(useUserStore().roles.includes('Association'))
    {
      // alert(JSON.stringify(dashboardData.value));
      asssociationActivity.value=dashboardData.value.data.activityCount;
      asssociationDonation.value=dashboardData.value.data.totalDonationAmount;
      asssociationEquipment.value=dashboardData.value.data.equipmentCount;
      donations.value=dashboardData.value.data.donations;

    }
   
    
    
  }

  // Transaction Graph
  const transactionData = ref([
    {
      name: "Total Job Payment",
      data: monthlyJobPayment.value,
    },
    {
      name: "Total Care-service",
      data: monthlyPayment.value,
    },
  ]);

              
  const series = ref(associationDonation.value);

  const chartOptions = computed(() => ({
    chart: {
      id: "apexChart",
      type: "pie",
    },
    labels: associationList.value,
    legend: {
      position: "top",
    },
    theme: {
      mode: "light",
      palette: "palette1",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  }));

  onMounted(() => {
    setTimeout(() => {
      changeKey.value++;
    }, 500);
  });



const changeKey = ref(0);

const customers = [
  {
    name: "Iqmal",
    age: "25",
    city: "Kuala Lumpur",
    country: "Malaysia",
    totalPurchase: 1524,
    purchase: 23,
  },
  {
    name: "Adi",
    age: "45",
    city: "Pulau Pinang",
    country: "Malaysia",
    totalPurchase: 643,
    purchase: 14,
  },
  {
    name: "Raziq",
    age: "21",
    city: "Kelantan",
    country: "Malaysia",
    totalPurchase: 543,
    purchase: 12,
  },
  {
    name: "Haqeem",
    age: "19",
    city: "Negeri Sembilan",
    country: "Malaysia",
    totalPurchase: 258,
    purchase: 6,
  },
];



const chartOptionsTransaction = computed(() => ({
  chart: {
    height: 350,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  colors: ["#6366F1", "#F97316"],
  yaxis: {
    labels: {
      style: {
        colors: "#9CA3AF",
        fontSize: "12px",
      },
    },
  },
  xaxis: {
    type: "datetime",
    categories: [
      "2022-01-01",
      "2022-02-01",
      "2022-03-01",
      "2022-04-01",
      "2022-05-01",
      "2022-06-01",
      "2022-07-01",
      "2022-08-01",
      "2022-09-01",
      "2022-10-01",
      "2022-11-01",
      "2022-12-01",
    ],
    labels: {
      style: {
        colors: "#9CA3AF",
        fontSize: "14px",
        fontWeight: 400,
      },
      datetimeFormatter: {
        month: "MMM",
      },
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    labels: {
      colors: "#9CA3AF",
      useSeriesColors: false,
    },
  },
  tooltip: {
    x: {
      format: "MMMM",
    },
  },
}));

onMounted(() => {
  setTimeout(() => {
    changeKey.value++;
  }, 500);
});
</script>

<template>
  <div v-if="userStore.roles.includes('Superadmin') || userStore.roles.includes('Admin')">
    <!-- First Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-x-6">
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-pink-100 rounded-2xl"
          >
            <Icon
              class="text-pink-500"
              name="icon-park:association"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ totAssociation }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Association
            </span>
          </div>
        </div>
      </rs-card>

      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-purple-100 rounded-2xl"
          >
            <Icon
              class="text-purple-500"
              name="streamline:health-medical-heart-rate-health-beauty-information-data-beat-pulse-monitor-heart-rate-info"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ totRehab }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Rehab center
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
              name="icon-park-twotone:nurse-cap"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ totCustomer }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Care taker
            </span>
          </div>
        </div>
      </rs-card>

      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-blue-100 rounded-2xl"
          >
            <Icon
              class="text-blue-500"
              name="medical-icon:i-outpatient"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ totCaretaker }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Customer
            </span>
          </div>
        </div>
      </rs-card>
      
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-x-6">
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-green-100 rounded-2xl"
          >
            <Icon
              class="text-green-500"
              name="bi:list-task"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ totJob }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Job Created
            </span>
          </div>
        </div>
      </rs-card>

      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-teal-100 rounded-2xl"
          >
            <Icon
              class="text-teal-500"
              name="material-symbols:task-alt-rounded"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ totJobComplete }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Job Complete
            </span>
          </div>
        </div>
      </rs-card>

      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-yellow-100 rounded-2xl"
          >
            <Icon
              class="text-yellow-500"
              name="ic:round-pending"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">RM {{ totPendingPayment }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Pending Payment
            </span>
          </div>
        </div>
      </rs-card>

      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-red-100 rounded-2xl"
          >
            <Icon
              class="text-red-500"
              name="mdi:cash-refund"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">RM {{ totRefundPayment }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Refund Payment
            </span>
          </div>
        </div>
      </rs-card>
    </div>

    <div class="flex flex-col md:flex-row gap-x-6">
      <div class="w-12/2 md:w-8/12 flex flex-col">
        <!-- Graph -->
        <rs-card class="flex-1">
          <template #header> Transaction </template>
          <template #body>
            <client-only>
              <VueApexCharts
                :key="changeKey"
                width="100%"
                height="300"
                name="area"
                :options="chartOptionsTransaction"
                :series="transactionData"
              ></VueApexCharts
            ></client-only>
          </template>
        </rs-card>
        <rs-card class="flex-1">
          <template #header> Jobs</template>
          <template #body>
            <div
              v-for="(val, index) in jobList" :key="index"
              class="flex justify-between items-center rounded-lg bg-[rgb(var(--bg-1))] p-5 first:mt-0 mt-3"
            >
              <div class="flex items-center gap-x-4">
                <!-- <img
                  src="@/assets/img/avatar/user.webp"
                  class="h-10 w-10 rounded-lg"
                /> -->
                <div class="flex-1">
                  <div class="flex flex-col">
                    <span
                      class="text-gray-900 dark:text-white font-semibold text-lg"
                    >
                      {{ val.job_title }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-50 text-sm">
                      RM{{ parseFloat(val.job_payment).toFixed(2) }} |
                      {{ val.job_status }} 
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  class="flex items-center p-4 rounded-full bg-[rgb(var(--bg-2))] hover:bg-[rgb(var(--bg-2))]/10 shadow-md"
                >
                  <Icon v-if="val.job_status =='PENDING'" size="20px" name="streamline:warning-triangle-solid"></Icon>
                  <Icon v-if="val.job_status =='ASSIGN'" size="20px" name="clarity:assign-user-solid"></Icon>
                  <Icon v-if="val.job_status =='COMPLETED'" size="20px" name="octicon:tracked-by-closed-completed-16"></Icon>
                </button>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
      <div class="w-12/2 md:w-4/12 flex flex-col">
        <!-- Monthly Target Radial -->
        <rs-card class="flex-1">
          <template #header> Donation </template>
          <template #body>
            <ClientOnly>
              <VueApexCharts
                :key="changeKey"
                width="100%"
                height="300"
                type="pie"
                :options="chartOptions"
                :series="series"
              ></VueApexCharts>
            </ClientOnly>            
            <hr class="my-4" />
            <div v-if="donationList.length > 0"
              class="flex item-center gap-x-4"
              :class="{
                'mt-0': index === 0,
                'mt-3': index !== 0,
              }"
              v-for="(val, index) in donationList"  :key="index"
            >
            <Icon class="h-20 w-20 object-cover rounded-lg" name="guidance:money"></Icon>
              <div class="flex-1 flex items-center">
                <div>
                  <span class="font-semibold text-lg leading-tight"
                    >{{ val.user_donation_donation_user_idTouser.userFullName }}</span
                  >
                  <p>
                    {{ val.user_donation_donation_association_idTouser.userFullName }}<br>
                    RM {{ val.donation_amount }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else>
              <h4>No Donation List</h4>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>

  <div v-if="userStore.roles.includes('Rehab center')">
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-pink-100 rounded-2xl"
          >
            <Icon
              class="text-pink-500"
              name="arcticons:activity-manager"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ rehabActivity }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Activity
            </span>
          </div>
        </div>
      </rs-card>

      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-purple-100 rounded-2xl"
          >
            <Icon
              class="text-purple-500"
              name="icon-park-outline:google-ads"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ rehabAds }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Ads
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
              name="streamline:wheelchair-1-solid"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ rehabEquipment }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Equipment
            </span>
          </div>
        </div>
      </rs-card>
    </div>

    <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">Top 5 of Equipments </div>          
  
          <rs-table v-if="equipments.length > 0"
            :data="equipments"
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
          <template #Name ="equipments" >
                {{ equipments.value.equipment_name}}
          </template>
          <template #type ="equipments" >
                {{ equipments.value.lookup_equipment_equipment_typeTolookup.lookupValue}}
          </template>
          <template #PIC ="equipments" >
                {{ equipments.value.equipment_pic_name}}<br>
                {{ equipments.value.equipment_pic_phoneNum}}
          </template>
          <template #status ="equipments" >
                {{ equipments.value.lookup_equipment_equipment_statusTolookup.lookupValue}}
          </template>
          <template #createdAt ="equipments" >
                {{ formatDate(equipments.value.created_at)}}
          </template>            
          </rs-table>
          <div v-else> No data</div>
        </div>
      </div>
  </div>

  <div v-if="userStore.roles.includes('Association')">
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-pink-100 rounded-2xl"
          >
            <Icon
              class="text-pink-500"
              name="arcticons:activity-manager"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ asssociationActivity }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Activity
            </span>
          </div>
        </div>
      </rs-card>

      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-purple-100 rounded-2xl"
          >
            <Icon
              class="text-purple-500"
              name="icon-park-outline:google-ads"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">RM {{ asssociationDonation }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Ads
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
              name="streamline:wheelchair-1-solid"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">{{ asssociationEquipment }}</span>
            <span class="text-base font-semibold text-gray-500">
              Total Equipment
            </span>
          </div>
        </div>
      </rs-card>
    </div>

    <div class="pb-20">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-lg font-medium mb-4">List of Donation </div>          
  
          <rs-table v-if="donations.length > 0"
            :data="donations"
            :options="{
              variant: 'default',
              striped: true,
              borderless: true,
            }"
            :field = "field2"
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
            
          </rs-table>
          <div v-else> No data</div>
        </div>
      </div>
  </div>
</template>
