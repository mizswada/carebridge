<script setup>
definePageMeta({
  title: "Forgot Password",
  layout: "empty",
  middleware: ["dashboard"],
});

const { $swal } = useNuxtApp();

const loading = ref(false);
const form = ref({
  email: "",
});

const forgotPassword = async () => {
  const { data } = await useFetch("/api/auth/forgot-password", {
    method: "POST",
    body: {
      email: form.email,
    },
  });

  if (data.value.statusCode === 200) {
    $swal.fire({
      title: "Success",
      text: data.value.message,
      icon: "success",
      timer: 3000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  } else {
    $swal.fire({
      title: "Error",
      text: data.value.message,
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};
</script>

<template>
  <div
    class="flex-none md:flex justify-center text-center items-center h-screen"
  >
    <div class="w-full md:w-3/4 lg:w-1/2 xl:w-2/6 relative">
      <rs-card class="h-screen md:h-auto px-10 md:px-16 py-12 md:py-20 mb-0">
        <div
          class="absolute -bottom-3 left-3 img-container flex justify-start items-center mb-5"
        >
          <img
            src="@/assets/img/logo/logo-carebridge.png"
            class="max-w-[90px]"
          />
        </div>
        <h3 class="mb-4">Forgot Password</h3>
        <p class="text-slate-500 mb-6">
          Please input the correct email to reset the password.
        </p>
        <FormKit
          type="form"
          :actions="false"
          :incomplete-message="false"
          @submit="forgotPassword"
        >
          <div class="grid grid-cols-1">
            <FormKit label="Email" type="email" v-model="form.email" outer-class="text-left" />

             <!-- Update button to show loading state -->
             <rs-button :btn-type="'submit'" :disabled="loading" class="w-full">
              <template v-if="loading">
                <span class="loader mr-2"></span> <!-- Optional loader icon -->
                Loading...
              </template>
              <template v-else>
                Validate Email
              </template>
            </rs-button>
          </div>
        </FormKit>
        
        <p class="mt-3 text-center text-slate-500">
          Already have an account?
          <NuxtLink to="/login" class="text-primary hover:underline"
            >Login</NuxtLink
          >
        </p>
      </rs-card>
    </div>
  </div>
</template>
