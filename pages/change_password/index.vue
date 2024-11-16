<script setup>
definePageMeta({
  title: "Change Password",
});

import { useUserStore } from "~/stores/user";
const { $swal, $router } = useNuxtApp();

const userStore = useUserStore();
const id = userStore.userId;

const passwordVisible = ref(false);
const passwordVisible2 = ref(false);
const inputPassword = ref("");
const inputPassword2 = ref("");
const errorPassword = ref("");
const errorPassword2 = ref("");

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const togglePasswordVisibility2 = () => {
  passwordVisible2.value = !passwordVisible2.value;
};

// Password validation function
const validatePassword = (password) => {
  const lengthCheck = password.length >= 8;
  const strengthCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  
  if (!lengthCheck) {
    return 'Password must be at least 8 characters long.';
  }
  
  if (!strengthCheck) {
    return 'Password must contain uppercase, lowercase, number, and special character.';
  }
  
  return '';
};

// Watch for changes on inputPassword2 to validate in real-time
watch(inputPassword2, (newVal) => {
  errorPassword2.value = validatePassword(newVal);
});

const submitForm = async () => {
  // Reset errors
  errorPassword.value = validatePassword(inputPassword.value);
  errorPassword2.value = validatePassword(inputPassword2.value);

  // Stop submission if there are any validation errors
  if (errorPassword.value || errorPassword2.value) return;

  // Ensure that old and new passwords are different
  if (inputPassword.value === inputPassword2.value) {
    errorPassword2.value = "New password must be different from the old password.";
    return;
  }


  try {
    const { data: update } = await useFetch("/api/changePassword", {
      initialCache: false,
      method: "POST",
      body: JSON.stringify({
        id: userStore.userId,
        oldPassword: inputPassword.value,
        newPassword: inputPassword2.value,
      }),
    });

    // alert(JSON.stringify(update.value));

    if (update.value?.response === 200) {
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
    } else if (update.value?.response === 401) {
      $swal.fire({
        position: "center",
        title: "Error",
        text: update.value.message,
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-between items-right mb-6">
      <h2 class="text-xl font-semibold">Change Password</h2>
    </div>

    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <FormKit
          :type="passwordVisible ? 'text' : 'password'"
          label="Password *"
          v-model="inputPassword"
          :class="{'border-red-500': errorPassword}"
          placeholder="Password"
          required
        >
          <template #suffix>
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-association items-association"
            >
              <Icon
                v-if="passwordVisible"
                name="material-symbols:visibility"
                size="19"
              />
              <Icon
                v-else
                name="material-symbols:visibility-off"
                size="19"
              />
            </button>
          </template>
        </FormKit>
        <p v-if="errorPassword" class="text-red-500 text-sm">{{ errorPassword }}</p>
      </div>

      <div class="mb-4">
        <FormKit
          :type="passwordVisible2 ? 'text' : 'password'"
          label="New Password *"
          v-model="inputPassword2"
          :class="{'border-red-500': errorPassword2}"
          placeholder="New Password"
          required
          minlength="8"
        >
          <template #suffix>
            <button
              type="button"
              @click="togglePasswordVisibility2"
              class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-association items-association"
            >
              <Icon
                v-if="passwordVisible2"
                name="material-symbols:visibility"
                size="19"
              />
              <Icon
                v-else
                name="material-symbols:visibility-off"
                size="19"
              />
            </button>
          </template>
        </FormKit>
        <p v-if="errorPassword2" class="text-red-500 text-sm">{{ errorPassword2 }}</p>
      </div>

      <div class="md:col-span-2 mt-6">
        <rs-button variant="primary" type="submit">Save Changes</rs-button>
      </div>
    </form>
  </div>
</template>
