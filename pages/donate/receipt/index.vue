<script setup>
definePageMeta({
  title: "Payment Success",
  layout: "empty",
  middleware: ["dashboard"],
});

import { DateTime } from "luxon";
const orderID = useRoute().query.order_id;
const statusID = useRoute().query.status_id;

const { data: paymentInfo } = await useFetch(
  "/api/apps/association/donate/receipt/get",
  {
    method: "GET",
    query: {
      orderID: orderID,
    },
  }
);

/* if (!orderID || !statusID || paymentInfo.value.statusCode != 200) {
  navigateTo("/subscription");
} else {
  if (
    paymentInfo.value.data.paymentDetails.paymentBillStatus == 1 &&
    statusID == 1
  ) {
    userStore.setPlan(paymentInfo.value.data.package);
  }
} */

const thousandOperatorTwoFixed = (amount) => {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

console.log(paymentInfo.data);
</script>

<template>
  <div class="flex flex-col items-center p-6 space-y-4 bg-gray-50 min-h-screen">
    
    <!-- Success Icon and Message -->
    <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg">
      <div v-if="statusID == 1" class="flex flex-col items-center space-y-2">
        <div class="bg-green-100 rounded-full p-4">
          <Icon name="material-symbols:check-circle" class="text-green-500 w-10 h-10" />
        </div>
        <h1 class="text-xl font-semibold text-gray-800 mt-4">Payment Success!</h1>
        <p class="text-2xl font-bold text-gray-800">RM {{ paymentInfo.data.paymentDetails.donation_amount }}</p>
      </div>

      <div v-else class="flex flex-col items-center space-y-2">
        <div class="bg-red-100 rounded-full p-4">
          <Icon name="material-symbols:cancel-rounded" class="text-red-500 w-10 h-10" />
        </div>
        <h1 class="text-xl font-semibold text-gray-800 mt-4">Payment Failed!</h1>
        <p class="text-2xl font-bold text-gray-800">RM {{ paymentInfo.data.paymentDetails.donation_amount }}</p>
      </div>
    </div>

    <!-- Payment Details Section -->
    <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg">
      <div class="flex justify-between items-center border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Payment Details</h2>
      </div>
      <div class="mt-4 space-y-3 text-sm text-gray-600">
        <div class="flex justify-between">
          <span>Ref Number</span>
          <span class="font-medium">{{ paymentInfo.data.paymentDetails.donation_reference_number }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>Payment Status</span>
          <div v-if="statusID == 1" class="flex items-center space-x-2">
            <Icon name="material-symbols:check-circle" class="text-green-500 w-5 h-5" />
            <span class="font-medium text-green-500">Success</span>
          </div>
          <div v-else class="flex items-center space-x-2">
            <Icon name="material-symbols:cancel-rounded" class="text-red-500 w-5 h-5" />
            <span class="font-medium text-green-500">Failed</span>
          </div>
        </div>
        <div class="flex justify-between">
          <span>Payment Time</span>
          <span class="font-medium">{{ DateTime.fromISO(paymentInfo.data.paymentDetails.donation_date).toFormat("yyyy-MM-dd hh:mm:ss") }} </span>
        </div>
        <div class="flex justify-between">
          <span>Total Donation</span>
          <span class="font-medium">RM
                {{
                  
                    paymentInfo.data.paymentDetails.donation_amount
                  
                }}</span>
        </div>
      </div>
    </div>

    <!-- Help Section -->
    <div class="w-full max-w-sm p-4 bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <Icon name="material-symbols:contact-support-outline" class="text-purple-500 w-6 h-6" />
      <div class="flex-1">
        <p class="text-sm text-gray-700 font-medium">Trouble With Your Payment?</p>
        <p class="text-xs text-purple-500 font-medium">Let us know on help center now!</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Custom styling can be added here if needed */
</style>
