<script setup>
definePageMeta({
  title: "Reset Password",
  layout: "empty",
  middleware: ["dashboard"],
});

const { $swal } = useNuxtApp();

const token = useRoute().params.token;
const togglePasswordVisibility = ref(false);
const toggleConfirmPasswordVisibility = ref(false);

const form = ref({
  password: "",
  confirmPassword: "",
});

if (!token) {
  $swal.fire({
    title: "Error",
    text: "Invalid token",
    icon: "error",
    timer: 3000,
    showConfirmButton: false,
  });
 window.location.href = "/login";
}

const { data: validateToken } = await useFetch("/api/apps/auth/validate-token", {
  method: "POST",
  body: {
    token: token,
    token_type: "FORGOT_PASSWORD"
  },
});

// console.log(validateToken.value);

if (validateToken.value.statusCode != 200) {
  $swal.fire({
    title: "Error",
    text: validateToken.value.message,
    icon: "error",
    timer: 3000,
    showConfirmButton: false,
  });

  setTimeout(() => {
    window.location.href = "/login";
  }, 2000); 
} 

const resetPassword = async () => {
  const { data } = await useFetch("/api/apps/auth/reset-password", {
    method: "POST",
    body: {
      token: token,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
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
            src="@/assets/img/logo/logo-word-black.svg"
            class="max-w-[90px]"
          />
        </div>
        <h3 class="mb-4">Reset Password</h3>
        <p class="text-slate-500 mb-6">
          Please fill in the form to reset your password.
        </p>

        <FormKit
          type="form"
          :actions="false"
          :incomplete-message="false"
          @submit="resetPassword"
        >
          <FormKit type="group">
            <FormKit
              v-model="form.password"
              :type="togglePasswordVisibility ? 'text' : 'password'"
              label="Password"
              label-class="text-left"
              name="password"
              :validation="[
                [
                  'matches',
                  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{6,}$/,
                ],
                ['required'],
              ]"
              validation-visibility="dirty"
              :validation-messages="{
                matches:
                  'Password must contain at least 6 characters, 1 letter and 1 number.',
              }"
            >
              <template #suffix>
                <div
                  class="bg-gray-100 hover:bg-slate-200 text-slate-400 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer"
                  @click="togglePasswordVisibility = !togglePasswordVisibility"
                >
                  <Icon
                    v-if="!togglePasswordVisibility"
                    name="ph:eye"
                    size="19"
                  ></Icon>
                  <Icon v-else name="ph:eye-slash" size="19"></Icon>
                </div>
              </template>
            </FormKit>

            <FormKit
              v-model="form.confirmPassword"
              :type="toggleConfirmPasswordVisibility ? 'text' : 'password'"
              label="Re-enter Password"
              label-class="text-left"
              name="password_confirm"
              validation="required|confirm"
              validation-visibility="dirty"
            >
              <template #suffix>
                <div
                  class="bg-gray-100 hover:bg-slate-200 text-slate-400 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer"
                  @click="
                    toggleConfirmPasswordVisibility =
                      !toggleConfirmPasswordVisibility
                  "
                >
                  <Icon
                    v-if="!toggleConfirmPasswordVisibility"
                    name="ph:eye"
                    size="19"
                  ></Icon>
                  <Icon v-else name="ph:eye-slash" size="19"></Icon>
                </div>
              </template>
            </FormKit>
          </FormKit>

          <rs-button btn-type="submit" class="w-full">
            Reset Password
          </rs-button>
        </FormKit>

      </rs-card>
    </div>
  </div>
</template>
