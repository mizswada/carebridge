<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Register",
  layout: "empty",
  middleware: ["dashboard"],
});

const router = useRouter();
const togglePasswordVisibility = ref(false);
const togglePasswordVisibility2 = ref(false);
const selectedOption = ref("Association");

// Form data object
const formData = ref({
  userUsername: "",
  userPassword: "",
  userPhone: "",
  userEmail: "",
  userFullName: "",
  userCategoryCode: "",
  userSecretKey: "",
  associationType: "",
  registrationNumber: "",
  licenseNumber: "",
  establishmentDate: "",
  associationAddressLine1: "",
  associationAddressLine2: "",
  associationAddressCity: "",
  associationAddressPostcode: "",
  associationAddressState: "",
  associationAddressCountry: "",
  contactNumber: "",
  emailAddress: "",
  website: "",
  affiliations: "",
  objectives: "",
  membershipDetails: "",
  operationalArea: "",
  supportingDocuments: "",
  annualRevenue: "",
  associationLogo: "",
  centerName: "",
  centerType: "",
  centerCapacity: "",
  operationalHours: "",
  centerDescription: "",
  geolocation: "",
  centerAddressLine1: "",
  centerAddressLine2: "",
  centerAddressCity: "",
  centerAddressPostcode: "",
  centerAddressState: "",
  centerAddressCountry: "",
  personInCharge: "",
  centerContactNumber: "",
  centerEmailAddress: "",
  centerWebsite: "",
  centerAffiliations: "",
  centerSupportingDocuments: "",
  roleID: "",
});

// Reactive variables for dropdown options
const stateOptions = ref([{ value: 0, label: "Please Select" }]);
const countryOptions = ref([{ value: 0, label: "Please Select" }]);
const categoryOptions = ref([{ value: 0, label: "Please Select a Category" }]);

// Fetch both states and countries from the single API endpoint on component mount
onMounted(async () => {
  await fetchLookupData();
  await fetchCategories();
});

// Function to fetch both states and countries
const fetchLookupData = async () => {
  try {
    const response = await fetch("/api/devtool/register/lookup");
    const result = await response.json();

    if (result.success) {
      // Populate state and country options with data from the API
      stateOptions.value = [
        { value: 0, label: "Please Select" },
        ...result.data.states,
      ];
      countryOptions.value = [
        { value: 0, label: "Please Select" },
        ...result.data.countries,
      ];
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error fetching lookup data:", error);
  }
};

// Function to fetch categories
const fetchCategories = async () => {
  try {
    const response = await fetch("/api/devtool/register/categories");
    const result = await response.json();

    if (result.success) {
      categoryOptions.value = [
        { value: 0, label: "Please Select a Category" },
        ...result.data,
      ];
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Computed property to set roleID based on selected option
const roleID = computed(() => {
  return selectedOption.value === "Association" ? 4 : 3;
});

const { $swal, $router } = useNuxtApp();
// Function to handle form submission
const handleSubmit = async () => {
  convertFieldsToInt([
    "associationType",
    "associationAddressState",
    "associationAddressCountry",
    "annualRevenue",
    "centerAddressState",
    "centerAddressCountry",
    "centerType",
    "centerCapacity",
  ]);

  // Ensure userCategoryCode is a string or null
  formData.value.roleID = String(roleID.value);

  if (formData.value.establishmentDate) {
    formData.value.establishmentDate = new Date(
      formData.value.establishmentDate
    ).toISOString();
  }

  await convertFileToBase64("supportingDocuments");
  await convertFileToBase64("associationLogo");

  replaceEmptyWithNull();

  formData.value.roleID = roleID.value;

  try {
    const response = await fetch("/api/devtool/register/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Show a success message with a timer before redirecting
      $swal.fire({
        position: "center",
        icon: "success",
        title: "Registration Successful",
        text: "You will be redirected to the login page shortly.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        $router.push("/login");
      }, 2000);
    } else {
      $swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    }
  } catch (error) {
    $swal.fire({
      icon: "error",
      title: "An error occurred",
      text: error.message,
    });
  }
};

// Helper functions remain the same as before
const convertFieldsToInt = (fields) => {
  fields.forEach((field) => {
    if (formData.value[field]) {
      formData.value[field] = parseInt(formData.value[field], 10);
    }
  });
};

const convertFileToBase64 = async (field) => {
  if (formData.value[field] instanceof File) {
    formData.value[field] = await fileToBase64(formData.value[field]);
  }
};

const replaceEmptyWithNull = () => {
  Object.keys(formData.value).forEach((key) => {
    if (formData.value[key] === "") {
      formData.value[key] = null;
    }
  });
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleFileChange = async (event, field) => {
  const file = event.target.files[0];
  if (file) {
    formData.value[field] = await fileToBase64(file);
  } else {
    formData.value[field] = null;
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <div class="w-full max-w-4xl">
      <rs-card class="w-full h-full px-10 md:px-16 py-12 md:py-20 mb-0">
        <h3 class="mb-4">Sign Up</h3>
        <p class="text-slate-500 mb-6 col-sp">
          Please fill in the form to create an account.
        </p>

        <!-- Radio Button Group -->
        <div class="mb-6 flex justify-center">
          <div class="flex space-x-4">
            <div class="border border-gray-300 p-4 rounded-md">
              <label>
                <input
                  type="radio"
                  value="Association"
                  v-model="selectedOption"
                />
                Association
              </label>
            </div>
            <div class="border border-gray-300 p-4 rounded-md">
              <label>
                <input
                  type="radio"
                  value="Rehab Center"
                  v-model="selectedOption"
                />
                Rehab Center
              </label>
            </div>
          </div>
        </div>

        <!-- Conditional Fields for Association -->
        <div v-if="selectedOption === 'Association'">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 class="col-span-2">Association Details</h4>
            <FormKit
              label="Association Name"
              type="text"
              label-class="text-left"
              v-model="formData.userFullName"
              :validation="'required'"
            />
            <FormKit
              label="Association Type"
              type="select"
              label-class="text-left"
              v-model="formData.associationType"
              :options="categoryOptions"
              :validation="'required'"
            />
            <FormKit
              label="Registration Number"
              type="text"
              label-class="text-left"
              v-model="formData.registrationNumber"
              :validation="'required'"
            />
            <FormKit
              label="License Number"
              type="text"
              label-class="text-left"
              v-model="formData.licenseNumber"
              :validation="'required'"
            />
            <FormKit
              label="Establishment Date"
              type="date"
              label-class="text-left"
              v-model="formData.establishmentDate"
              :validation="'required'"
            />
            <FormKit
              label="Email Address"
              type="email"
              label-class="text-left"
              v-model="formData.emailAddress"
              :validation="'required'"
            />
            <FormKit
              label="Website"
              type="url"
              label-class="text-left"
              v-model="formData.website"
              :validation="'required'"
            />
            <FormKit
              label="Affiliations"
              type="text"
              label-class="text-left"
              v-model="formData.affiliations"
              :validation="'required'"
            />
            <FormKit
              label="Objectives"
              type="text"
              label-class="text-left"
              v-model="formData.objectives"
              :validation="'required'"
            />
            <FormKit
              label="Membership Details"
              type="text"
              label-class="text-left"
              v-model="formData.membershipDetails"
              :validation="'required'"
            />
            <FormKit
              label="Operational Area"
              type="text"
              label-class="text-left"
              v-model="formData.operationalArea"
              :validation="'required'"
            />
            <FormKit
              label="Organization Contact Number"
              type="tel"
              label-class="text-left"
              v-model="formData.contactNumber"
              :validation="'required'"
            />
            <hr class="col-span-2 my-4" style="border-color: black" />

            <h4 class="col-span-2">Association Address</h4>
            <FormKit
              label="Address Line 1"
              type="text"
              label-class="text-left"
              v-model="formData.associationAddressLine1"
              :validation="'required'"
            />
            <FormKit
              label="Address Line 2"
              type="text"
              label-class="text-left"
              v-model="formData.associationAddressLine2"
              :validation="'required'"
            />
            <FormKit
              label="City"
              type="text"
              label-class="text-left"
              v-model="formData.associationAddressCity"
              :validation="'required'"
            />
            <FormKit
              label="Postcode"
              type="text"
              label-class="text-left"
              v-model="formData.associationAddressPostcode"
              :validation="'required'"
            />
            <FormKit
              label="State"
              type="select"
              label-class="text-left"
              v-model="formData.associationAddressState"
              :options="stateOptions"
              :validation="'required'"
            />
            <FormKit
              label="Country"
              type="select"
              label-class="text-left"
              v-model="formData.associationAddressCountry"
              :options="countryOptions"
              :validation="'required'"
            />

            <hr class="col-span-2 my-4" style="border-color: black" />
            <h4 class="col-span-2">Contact Person</h4>
            <FormKit
              label="Username"
              type="text"
              label-class="text-left"
              v-model="formData.userUsername"
              :validation="'required'"
            />
            <FormKit
              label="Password"
              type="password"
              label-class="text-left"
              v-model="formData.userPassword"
            />
            <FormKit
              label="Phone"
              type="tel"
              label-class="text-left"
              v-model="formData.userPhone"
              :validation="'required'"
            />
            <FormKit
              label="Email"
              type="email"
              label-class="text-left"
              v-model="formData.userEmail"
              :validation="'required'"
            />
            <hr class="col-span-2 my-4" style="border-color: black" />
            <h4 class="col-span-2">Supporting Documents</h4>
            <FormKit
              label="Licenses or Certifications"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'supportingDocuments')"
              :validation="'required'"
            />
            <FormKit
              label="Annual Revenue"
              type="number"
              label-class="text-left"
              v-model="formData.annualRevenue"
            />
            <FormKit
              label="Association Logo"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'associationLogo')"
            />
            <FormKit
              label="Category Code"
              type="text"
              label-class="text-left"
              v-model="formData.userCategoryCode"
              :validation="'required'"
            />
            <FormKit
              label="Secret Key"
              type="text"
              label-class="text-left"
              v-model="formData.userSecretKey"
              :validation="'required'"
            />
          </div>
        </div>

        <!-- Conditional Fields for Rehab Center -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 class="col-span-2">Center Details</h4>
            <FormKit
              label="Center Name"
              type="text"
              label-class="text-left"
              v-model="formData.userFullName"
              :validation="'required'"
            />
            <FormKit
              label="Registration Number"
              type="text"
              label-class="text-left"
              v-model="formData.registrationNumber"
              :validation="'required'"
            />
            <FormKit
              label="License Number"
              type="text"
              label-class="text-left"
              v-model="formData.licenseNumber"
              :validation="'required'"
            />
            <FormKit
              label="Center Type"
              type="select"
              label-class="text-left"
              v-model="formData.centerType"
              :options="categoryOptions"
              :validation="'required'"
            />
            <FormKit
              label="Center Capacity"
              type="number"
              label-class="text-left"
              v-model="formData.centerCapacity"
              :validation="'required'"
            />
            <FormKit
              label="Operational Hours"
              type="text"
              label-class="text-left"
              v-model="formData.operationalHours"
              :validation="'required'"
            />
            <FormKit
              label="Website"
              type="url"
              label-class="text-left"
              v-model="formData.centerWebsite"
              :validation="'required'"
            />
            <FormKit
              label="Affiliations"
              type="text"
              label-class="text-left"
              v-model="formData.centerAffiliations"
              :validation="'required'"
            />
            <FormKit
              label="Center Description"
              type="text"
              label-class="text-left"
              v-model="formData.centerDescription"
              :validation="'required'"
            />
            <FormKit
              label="Contact Number"
              type="tel"
              label-class="text-left"
              v-model="formData.centerContactNumber"
              :validation="'required'"
            />
            <FormKit
              label="Email Address"
              type="email"
              label-class="text-left"
              v-model="formData.centerEmailAddress"
              :validation="'required'"
            />

            <hr class="col-span-2 my-4" style="border-color: black" />

            <h4 class="col-span-2">Center Address</h4>
            <FormKit
              label="Line Address 1"
              type="text"
              label-class="text-left"
              v-model="formData.centerAddressLine1"
              :validation="'required'"
            />
            <FormKit
              label="Line Address 2"
              type="text"
              label-class="text-left"
              v-model="formData.centerAddressLine2"
              :validation="'required'"
            />
            <FormKit
              label="City"
              type="text"
              label-class="text-left"
              v-model="formData.centerAddressCity"
              :validation="'required'"
            />
            <FormKit
              label="Postcode"
              type="text"
              label-class="text-left"
              v-model="formData.centerAddressPostcode"
              :validation="'required'"
            />
            <FormKit
              label="State"
              type="select"
              label-class="text-left"
              v-model="formData.centerAddressState"
              :options="stateOptions"
              :validation="'required'"
            />
            <FormKit
              label="Country"
              type="select"
              label-class="text-left"
              v-model="formData.centerAddressCountry"
              :options="countryOptions"
              :validation="'required'"
            />

            <hr class="col-span-2 my-4" style="border-color: black" />

            <h4 class="col-span-2">
              Geolocation (GPS Coordinates for easier accessibility)
            </h4>
            <FormKit
              label="Geolocation"
              type="text"
              label-class="text-left"
              v-model="formData.geolocation"
              :validation="'required'"
            />

            <hr class="col-span-2 my-4" style="border-color: black" />

            <h4 class="col-span-2">Person In Charge (PIC)</h4>
            <FormKit
              label="Username"
              type="text"
              label-class="text-left"
              v-model="formData.userUsername"
              :validation="'required'"
            />
            <FormKit
              label="Password"
              type="password"
              label-class="text-left"
              v-model="formData.userPassword"
            />
            <FormKit
              label="Email Address"
              type="email"
              label-class="text-left"
              v-model="formData.userEmail"
              :validation="'required'"
            />
            <FormKit
              label="Contact Number"
              type="tel"
              label-class="text-left"
              v-model="formData.userPhone"
              :validation="'required'"
            />

            <hr class="col-span-2 my-4" style="border-color: black" />

            <h4 class="col-span-2">Supporting Documents</h4>
            <FormKit
              label="Licenses or Certifications"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'centerSupportingDocuments')"
              :validation="'required'"
            />
            <FormKit label="Company Logo" type="file" label-class="text-left" />
          </div>
        </div>

        <FormKit
          type="checkbox"
          label="agreement"
          outer-class="col-span-1 md:col-span-2 mt-4"
          :validation="'required'"
        >
          <template #label>
            I agree to the
            <a class="text-primary hover:underline ml-1">Term and Services</a>
          </template>
        </FormKit>

        <FormKit type="button" @click="handleSubmit" input-class="w-full">
          Sign up
        </FormKit>

        <p class="mt-3 text-center text-slate-500">
          Already have an account?
          <NuxtLink to="/login" class="text-primary hover:underline">
            Login
          </NuxtLink>
        </p>
      </rs-card>
    </div>
  </div>
</template>
