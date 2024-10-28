<script setup>
definePageMeta({
  title: "Verify Account",
  layout: "empty",
  middleware: ["dashboard"],
});

const { $swal } = useNuxtApp();
const token = useRoute().params.token;

const verificationStatus = ref(null); // null = pending, true = success, false = failure
const verificationMessage = ref('');

if (!token) {
  $swal.fire({
    title: "Error",
    text: "Invalid token",
    icon: "error",
    timer: 2000,
    showConfirmButton: false,
  });
  window.location.href = "/login";
}

const { data: validateToken } = await useFetch("/api/apps/auth/validate-token", {
  method: "POST",
  body: {
    token: token,
    token_type: "REGISTRATION"
  },
});

if (validateToken.value.statusCode != 200) {

  verificationStatus.value = false;
  verificationMessage.value = validateToken.value.message;

  $swal.fire({
    title: "Error",
    text: validateToken.value.message,
    icon: "error",
    timer: 2000,
    showConfirmButton: false,
  });
 
  /* setTimeout(() => {
    window.location.href = "/login";
  }, 2000); */
} else {
  await verify_account();
}

async function verify_account(){
  const { data } = await useFetch("/api/apps/auth/verify-account", {
    method: "POST",
    body: {
      token: token,
    },
  });

  if (data.value.statusCode === 200) {

    verificationStatus.value = true;
    verificationMessage.value = data.value.message;

    $swal.fire({
      title: "Success",
      text: data.value.message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  } else {

    verificationStatus.value = false;
    verificationMessage.value = data.value.message;

    $swal.fire({
      title: "Error",
      text: data.value.message,
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  }
}

async function resendVerificationEmail() {
  const { data, error } = await useFetch("/api/apps/auth/resend-verification", {
    method: "POST",
    body: { 
      token: token,
     },  
  });

  if (data.value.statusCode === 200) {
    $swal.fire({
      title: "Success",
      text: data.value.message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } else {
    $swal.fire({
      title: "Error",
      text: "Failed to resend verification email.",
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  }
}
</script>

<template>
  <div
    class="flex-none md:flex justify-center text-center items-center h-screen"
  >
    <div class="w-full md:w-3/4 lg:w-1/2 xl:w-2/6 relative">
      <rs-card class="h-screen md:h-auto px-10 md:px-16 py-12 md:py-20 mb-0">
        <div
          class="text-center"
          style="
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
            clear: both;
            display: inline-block !important;
            border: none;
            height: auto;
            float: none;
            width: 10%;
            max-width: 58px;
          "
        >
          <svg v-if="verificationStatus === true" xmlns="http://www.w3.org/2000/svg" width="58" height="auto" viewBox="0 0 24 24">
            <path fill="#09eb24" d="m17.55 9.175l3.525-3.55q.3-.3.713-.3t.712.3t.3.713t-.3.712l-4.25 4.25q-.3.3-.7.3t-.7-.3l-2.125-2.125q-.3-.3-.3-.712t.3-.713t.7-.3t.7.3zM9 12q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 6v-.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2v.8q0 .825-.587 1.413T15 20H3q-.825 0-1.412-.587T1 18"/>
          </svg>

          <svg v-if="verificationStatus === false" xmlns="http://www.w3.org/2000/svg" width="58" height="auto" viewBox="0 0 24 24">
            <path fill="#eb0909" d="M8.5 4a3 3 0 1 0 0 6a3 3 0 0 0 0-6m-5 3a5 5 0 1 1 10 0a5 5 0 0 1-10 0m13.879-.536L19.5 8.586l2.121-2.122l1.415 1.415L20.914 10l2.121 2.121l-1.414 1.415l-2.121-2.122l-2.121 2.122l-1.415-1.415L18.087 10l-2.121-2.121zM0 19a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v2h-2v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2H0z"/>
          </svg>

        </div>
        <h3 class="mb-4">
          {{ verificationStatus === true ? 'Verification Success' : 'Verification Failed' }}
        </h3>
        <p class="text-slate-500 mb-6">
          {{ verificationStatus === true ? 'Congratulations, your account has been verified.' : 'Unfortunately, your account verification was not successful.' }}
        </p>

        

        <div class="grid grid-cols-1">
          <rs-button v-if="verificationStatus === false" @click="resendVerificationEmail" class="btn btn-primary w-full">
            Resend Verification Email
          </rs-button>
        </div>
        <!-- <div class="grid grid-cols-1">
          <FormKit label="Email" type="email" outer-class="text-left" />
          <NuxtLink to="/reset-password">
            <FormKit type="button" input-class="w-full">Validate Email</FormKit>
          </NuxtLink>
        </div>
        <p class="mt-3 text-center text-slate-500">
          Already have an account?
          <NuxtLink to="/login" class="text-primary hover:underline"
            >Login</NuxtLink
          >
        </p> -->
      </rs-card>
    </div>
  </div>
</template>
