<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Register",
  layout: "empty",
  middleware: ["dashboard"],
});

const router = useRouter();
const passwordVisible = ref(false);
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
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
  associationCategory: "",
  picName: "",
  picPhoneNum: "",
  picEmail: "",
  objectives: "",
  website: "",
  membershipDetails: "",
  operationalArea: "",
  associationLogo: "",
  documentLicenses: "",
  documentsCertificates: "",
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
  roleID: 4, // Default to 4 for "Association"
});

// Reactive variables for dropdown options
const stateOptions = ref([{ value: 0, label: "Please Select" }]);
const countryOptions = ref([{ value: 0, label: "Please Select" }]);
const associationCategoryOptions = ref([
  { value: 0, label: "Please Select a Category" },
]);
const associationTypeOptions = ref([
  { value: 0, label: "Please Select a Type" },
]);
const rehabCenterCategoryOptions = ref([
  { value: 0, label: "Please Select a Category" },
]);
const centerTypeOptions = ref([{ value: 0, label: "Please Select a Type" }]);



// Watch selectedOption and update formData.roleID accordingly
watch(selectedOption, (newVal) => {
  formData.value.roleID = newVal === "Association" ? 4 : 3;
  console.log(
    `selectedOption changed to: ${newVal}, roleID set to: ${formData.value.roleID}`
  );
});

const lookupData = await $fetch('/api/lookup', {
    method: 'GET'
});
stateOptions.value = lookupData.data.filter(item => item.lookupType === 'state_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
stateOptions.value.unshift({ value: "", label: "Please choose" });

countryOptions.value = lookupData.data.filter(item => item.lookupType === 'country_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
countryOptions.value.unshift({ value: "", label: "Please choose" });

associationTypeOptions.value = lookupData.data.filter(item => item.lookupType === 'associationType_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
associationTypeOptions.value.unshift({ value: "", label: "Please choose" });

centerTypeOptions.value = lookupData.data.filter(item => item.lookupType === 'associationType_list').map(item => ({ value: item.lookupID, label: item.lookupValue }));
centerTypeOptions.value.unshift({ value: "", label: "Please choose" });

const categoryData = await $fetch('/api/category', {
    method: 'GET'
});

associationCategoryOptions.value = categoryData.data.filter(item => item.type === 'association').map(item => ({ value: item.category_id, label: item.name  }));
associationCategoryOptions.value.unshift({ value: "", label: "Please choose" });

rehabCenterCategoryOptions.value = categoryData.data.filter(item => item.type === 'rehab_center').map(item => ({ value: item.category_id, label: item.name  }));
rehabCenterCategoryOptions.value.unshift({ value: "", label: "Please choose" });


const { $swal, $router } = useNuxtApp();

// Function to handle file upload and processing
const handleFileChange = async (event, field) => {
  const file = event.target.files[0];
  if (file) {
    const fileType = file.type;
    try {
      let fileToUpload;

      if (fileType.startsWith("image/")) {
        const compressedImage = await resizeAndCompressImage(
          file,
          800,
          600,
          0.7
        );
        fileToUpload = compressedImage;
      } else if (fileType === "application/pdf") {
        fileToUpload = file; // No need to compress PDFs
      } else {
        $swal.fire({
          position: "center",
          icon: "error",
          title: "Unsupported Format",
          text: "Only images and PDF documents are supported.",
        });
        return;
      }

      // Convert file to base64 and upload it to the server
      const filePath = await uploadFile(fileToUpload, file.name); // Upload the file and get the file path

      formData.value[field] = filePath; // Store the file path in formData, not the Base64 string
    } catch (error) {
      $swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "An error occurred while processing the file.",
      });
    }
  } else {
    formData.value[field] = null; // If no file selected, reset field
  }
};

// Helper function to convert image to Base64
async function ToBase64OpsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result); // Resolve with Base64 string
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Helper function to resize and compress images
function resizeAndCompressImage(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          quality
        );
      };
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Function to handle form submission
const handleSubmit = async () => {
  // Ensure the roleID is a string
  formData.value.roleID = String(formData.value.roleID);

  // Convert establishmentDate to ISO string if provided
  if (formData.value.establishmentDate) {
    formData.value.establishmentDate = new Date(
      formData.value.establishmentDate
    ).toISOString();
  }

  // Sanitize empty fields to null
  replaceEmptyWithNull();

  try {
    // Continue with form submission after successful uploads
    const response = await fetch("/api/register/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData.value),
    });

    // Handle the response
    const result = await response.json();

    if (response.ok && result.success) {
      // Show success message
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
      // Show error message from backend response
      $swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "An unexpected error occurred.",
      });
    }
  } catch (error) {
    // Catch and handle any errors during form submission
    $swal.fire({
      icon: "error",
      title: "An error occurred",
      text: error.message || "Please try again.",
    });
  }
};

// Helper function to upload a file to the backend
const uploadFile = async (file, filename) => {
  try {
    const base64Data = await ToBase64OpsImage(file); // Convert file to base64 string

    const response = await $fetch("/api/register/upload", {
      method: "POST",
      body: {
        base64Data: base64Data, // Upload base64 image
        filename: filename, // Pass the filename to save it properly
      },
    });

    // Check if the response contains the file path
    if (
      response.statusCode === 200 &&
      response.data &&
      response.data.filePath
    ) {
      return response.data.filePath; // Return the file path after successful upload
    } else {
      throw new Error("File upload failed: invalid response from server");
    }
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("File upload error: " + error.message);
  }
};

// Helper function to replace empty fields with null
const replaceEmptyWithNull = () => {
  Object.keys(formData.value).forEach((key) => {
    if (formData.value[key] === "") {
      formData.value[key] = null;
    }
  });
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
        <div class="mb-4">
          <h4 class="col-span-2">Select Your Role</h4>
        </div>

        <div class="mb-6 flex justify-center w-full">
          <div class="flex space-x-4 w-full">
            <!-- Association Option -->
            <div
              :class="[
                'border-2', // Increase border thickness
                'border-black', // Set border color to black
                'p-4', // Padding inside the box
                'rounded-md', // Rounded corners
                'w-full', // Full width of each option
                'bg-black', // Black background by default
                'text-white', // White text by default
                'flex', // Flex layout for centering
                'items-center', // Vertically center content
                'justify-center', // Horizontally center content
                selectedOption === 'Association' ? 'opacity-100' : 'opacity-50', // Full opacity if selected, reduced opacity if not
                'transition-opacity duration-300', // Smooth transition for opacity change
              ]"
            >
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="Association"
                  v-model="selectedOption"
                  class="radio-button accent-purple-600"
                />
                <span class="font-bold uppercase">Association</span>
              </label>
            </div>

            <!-- Rehab Center Option -->
            <div
              :class="[
                'border-2', // Increase border thickness
                'border-black', // Set border color to black
                'p-4', // Padding inside the box
                'rounded-md', // Rounded corners
                'w-full', // Full width of each option
                'bg-black', // Black background by default
                'text-white', // White text by default
                'flex', // Flex layout for centering
                'items-center', // Vertically center content
                'justify-center', // Horizontally center content
                selectedOption === 'Rehab Center'
                  ? 'opacity-100'
                  : 'opacity-50', // Full opacity if selected, reduced opacity if not
                'transition-opacity duration-300', // Smooth transition for opacity change
              ]"
            >
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="Rehab Center"
                  v-model="selectedOption"
                  class="radio-button accent-purple-600"
                />
                <span class="font-bold uppercase">Rehab Center</span>
              </label>
            </div>
          </div>
        </div>

        <hr class="border-black w-full border-1" />
        <!-- Conditional Fields for Association -->
        <div v-if="selectedOption === 'Association'">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 class="col-span-2 mt-4">Association Details</h4>
            <!-- <FormKit
              label="Username"
              type="text"
              label-class="text-left"
              v-model="formData.userUsername"
              :validation="'required'"
              placeholder="Account Username"
            /> -->
            <FormKit
              label="Email"
              type="email"
              label-class="text-left"
              v-model="formData.userEmail"
              :validation="'required'"
              placeholder="Association Email"
            />
            <FormKit
              label="Password"
              type="password"
              label-class="text-left"
              v-model="formData.userPassword"
              :validation="'required'"
              placeholder="Account Password"
            />
            <FormKit
              label="Secret Key"
              type="text"
              label-class="text-left"
              v-model="formData.userSecretKey"
              :validation="'required'"
            />
            <FormKit
              label="Category Code"
              type="text"
              label-class="text-left"
              v-model="formData.userCategoryCode"
              :validation="'required'"
            />
            <FormKit
              label="Full Name"
              type="text"
              label-class="text-left"
              v-model="formData.userFullName"
              :validation="'required'"
              placeholder="Association Fullname"
            />
           
            <FormKit
              label="Phone"
              type="tel"
              label-class="text-left"
              v-model="formData.userPhone"
              :validation="'required'"
              placeholder="Association Phone Number"
            />
            <FormKit
              label="Association Category"
              type="select"
              label-class="text-left"
              v-model="formData.associationCategory"
              :options="associationCategoryOptions"
              :validation="'required'"
            />
            <FormKit
              label="Association Type"
              type="select"
              label-class="text-left"
              v-model="formData.associationType"
              :options="associationTypeOptions"
              :validation="'required'"
            />
            <FormKit
              label="Registration Number"
              type="text"
              label-class="text-left"
              v-model="formData.registrationNumber"
              :validation="'required'"
              placeholder="Association Registration Number"
            />
            <FormKit
              label="License Number"
              type="text"
              label-class="text-left"
              v-model="formData.licenseNumber"
              :validation="'required'"
              placeholder="Association License Number"
            />
            <FormKit
              label="Establishment Date"
              type="date"
              label-class="text-left"
              v-model="formData.establishmentDate"
              :validation="'required'"
            />
            <FormKit
              label="Objectives"
              type="textarea"
              label-class="text-left"
              v-model="formData.objectives"
            />
            <FormKit
              label="Website"
              type="url"
              label-class="text-left"
              v-model="formData.website"
              :validation="'required'"
              placeholder="Association website URL"
            />
            <FormKit
              label="Operational Area"
              type="text"
              label-class="text-left"
              v-model="formData.operationalArea"
            />
            <FormKit
              label="Membership Details"
              type="text"
              label-class="text-left"
              v-model="formData.membershipDetails"
            />

            <hr class="border-t border-black w-full col-span-2 my-4" />

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
            <hr class="border-t border-black w-full col-span-2 my-4" />
            <h4 class="col-span-2">Contact Person Details</h4>
            <FormKit
              label="Contact Person Name"
              type="text"
              label-class="text-left"
              v-model="formData.picName"
              :validation="'required'"
            />
            <FormKit
              label="Contact Person Phone"
              type="text"
              label-class="text-left"
              v-model="formData.picPhoneNum"
              :validation="'required'"
            />
            <FormKit
              label="Contact Person Email"
              type="email"
              label-class="text-left"
              v-model="formData.picEmail"
              :validation="'required'"
            />
            <hr class="border-t border-black w-full col-span-2 my-4" />
            <h4 class="col-span-2">Supporting Documents</h4>

            <FormKit
              label="Licenses"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'documentLicenses')"
              :validation="'required'"
            />
            <FormKit
              label="Certificates"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'documentsCertificates')"
              :validation="'required'"
            />
            <FormKit
              label="Association Logo"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'associationLogo')"
              :validation="'required'"
            />
          </div>
        </div>

        <!-- Conditional Fields for Rehab Center -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h4 class="col-span-2 mt-4">Center Details</h4>
            <!-- <FormKit
              label="Username"
              type="text"
              label-class="text-left"
              v-model="formData.userUsername"
              :validation="'required'"
              placeholder="Account Username"
            /> -->
            <FormKit
              label="Email"
              type="email"
              label-class="text-left"
              v-model="formData.userEmail"
              :validation="'required'"
              placeholder="Center Email"
            />

            <FormKit
              label="Password"
              type="password"
              label-class="text-left"
              v-model="formData.userPassword"
              :validation="'required'"
              placeholder="Account Password"
            />
            <!-- <FormKit
              label="Secret Key"
              type="text"
              label-class="text-left"
              v-model="formData.userSecretKey"
              :validation="'required'"
            />
            <FormKit
              label="Category Code"
              type="text"
              label-class="text-left"
              v-model="formData.userCategoryCode"
              :validation="'required'"
            /> -->
            <FormKit
              label="Full Name"
              type="text"
              label-class="text-left"
              v-model="formData.userFullName"
              :validation="'required'"
              placeholder="Center Fullname"
            />
            
            <FormKit
              label="Phone"
              type="tel"
              label-class="text-left"
              v-model="formData.userPhone"
              :validation="'required'"
              placeholder="Center Phone Number"
            />
            <FormKit
              label="Registration Number"
              type="text"
              label-class="text-left"
              v-model="formData.registrationNumber"
              :validation="'required'"
              placeholder="Center Registration Number"
            />
            <FormKit
              label="License Number"
              type="text"
              label-class="text-left"
              v-model="formData.licenseNumber"
              :validation="'required'"
              placeholder="Center License Number"
            />
            <FormKit
              label="Center Category"
              type="select"
              label-class="text-left"
              v-model="formData.rehabCenterCategory"
              :options="rehabCenterCategoryOptions"
              :validation="'required'"
            />
            <FormKit
              label="Operational Hours"
              type="text"
              label-class="text-left"
              v-model="formData.operationalHours"
              :validation="'required'"
              placeholder="Opening hours - Closing Hours"
            />
            <FormKit
              label="Website"
              type="url"
              label-class="text-left"
              v-model="formData.website"
              :validation="'required'"
              placeholder="Center website URL"
            />
            <FormKit
              label="Center Capacity"
              type="number"
              label-class="text-left"
              v-model="formData.centerCapacity"
              placeholder="Center Capacity"
            />
            <FormKit
              label="Geolocation"
              type="text"
              label-class="text-left"
              v-model="formData.geolocation"
              :validation="'required'"
            />
            <FormKit
              label="Center Description"
              type="textarea"
              label-class="text-left"
              v-model="formData.centerDescription"
            />
            <FormKit
              label="Center Type"
              type="select"
              label-class="text-left"
              v-model="formData.centerType"
              :options="centerTypeOptions"
              :validation="'required'"
            />

            <hr class="border-t border-black w-full col-span-2 my-4" />

            <h4 class="col-span-2">Center Address</h4>
            <FormKit
              label="Address Line 1"
              type="text"
              label-class="text-left"
              v-model="formData.centerAddressLine1"
              :validation="'required'"
            />
            <FormKit
              label="Address Line 2"
              type="text"
              label-class="text-left"
              v-model="formData.centerAddressLine2"
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
            <hr class="border-t border-black w-full col-span-2 my-4" />
            <h4 class="col-span-2">Person In Charge (PIC) Details</h4>
            <FormKit
              label="Person In Charge"
              type="text"
              label-class="text-left"
              v-model="formData.personInCharge"
              :validation="'required'"
              placeholder="PIC Name"
            />
            <FormKit
              label="Contact Number"
              type="tel"
              label-class="text-left"
              v-model="formData.contactNumber"
              :validation="'required'"
              placeholder="PIC Phone Number"
            />

            <hr class="border-t border-black w-full col-span-2 my-4" />
            <h4 class="col-span-2">Supporting Documents</h4>

            <FormKit
              label="Licenses"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'documentLicenses')"
              :validation="'required'"
            />
            <FormKit
              label="Certificates"
              type="file"
              label-class="text-left"
              @change="handleFileChange($event, 'documentsCertificates')"
              :validation="'required'"
            />
          </div>
        </div>

        <!-- Agreement Checkbox -->
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

        <!-- Submit Button -->
        <FormKit type="button" @click="handleSubmit" input-class="w-full">
          Sign up
        </FormKit>

        <!-- Redirect to Login -->
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

<style scoped>
.radio-button:checked + label {
  border-color: purple;
}

/* Optional: Adjust background and text color for better visibility */
.bg-purple-100 {
  background-color: #e9d5ff;
}
</style>
