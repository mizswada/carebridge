<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Job Listing",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal, $router } = useNuxtApp();
const router = useRouter();
// const jobId = route.query.id;

const jobList = ref([]);
const showModal = ref(false);
const showModalForm = ref({
  job_id: "",
  job_category: "",
  job_title: "",
  job_location_city: "",
  job_location_state: "",
  job_date: "",
  job_time: "",
  job_duration: "",
  job_payment: "",
  job_notes: "",
  job_stayin: "",
});
const modalType = ref("edit");
const showModalDelete = ref(false);
const showModalDeleteForm = ref({
  job_id: "",
  job_title: "",
});

// Call API
getJobList();

onMounted(async () => {
  await fetchCategories();
  await fetchLocationStates();
  await fetchJobStayinOptions();
  // console.log("Navigated Job ID:", jobId);
});

const jobCategoryOptions = ref([
  { value: 0, label: "Please Select a Category" },
]);
const jobLocationStateOptions = ref([
  { value: 0, label: "Please Select a State" },
]);
const jobStayinOptions = ref([{ value: 0, label: "Please Select an option" }]);

// Function to fetch job categories
const fetchCategories = async () => {
  try {
    const response = await fetch(
      "/api/devtool/care-service/service-list/category"
    );
    const result = await response.json();

    if (result.success) {
      jobCategoryOptions.value = [
        { value: 0, label: "Please Select a Category" },
        ...result.data.map((category) => ({
          value: category.id, // Ensure this is the correct category_id
          label: category.value, // Ensure this is the correct label
        })),
      ];
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error fetching job categories:", error);
  }
};

// Function to fetch location states
const fetchLocationStates = async () => {
  try {
    const response = await fetch(
      "/api/devtool/care-service/service-list/lookup?lookupTitle=state"
    );
    const result = await response.json();

    if (result.success) {
      jobLocationStateOptions.value = [
        { value: 0, label: "Please Select a State" },
        ...result.data.map((state) => ({
          value: state.id,
          label: state.value,
        })),
      ];
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error fetching location states:", error);
  }
};

const fetchJobStayinOptions = async () => {
  try {
    const response = await fetch(
      "/api/devtool/care-service/service-list/lookup?lookupTitle=job_stayin"
    );
    const result = await response.json();

    if (result.success) {
      jobStayinOptions.value = [
        { value: 0, label: "Please Select a Stay-in Requirement" },
        ...result.data.map((stayin) => ({
          value: stayin.id,
          label: stayin.value,
        })),
      ];
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error fetching job stay-in options:", error);
  }
};

async function getJobList() {
  const { data } = await useFetch(
    "/api/devtool/care-service/service-list/list",
    {
      initialCache: false,
    }
  );

  if (data.value?.statusCode === 200) {
    jobList.value = data.value.data.map((job) => ({
      job_id: job.job_id,
      job_category: job.job_category,
      job_title: job.job_title,
      job_location_city: job.job_location_city,
      job_location_state: job.job_location_state,
      job_date: new Date(job.job_date).toLocaleDateString("en-GB"),
      job_time: job.job_time,
      job_duration: job.job_duration,
      job_payment: job.job_payment,
      job_notes: job.job_notes,
      job_stayin: job.job_stayin,
      action: null,
    }));
  }
}

const navigateToDetails = (value) => {
  router.push({
    path: `/care-service/detail-list`, // Use path directly
    query: { id: value.job_id }, // Pass job_id as a query parameter
  });
};

// Open Modal Edit Job
const openModal = async (value) => {
  modalType.value = "edit";

  showModalForm.value = {
    job_id: value.job_id,
    job_category: value.job_category,
    job_title: value.job_title,
    job_location_city: value.job_location_city,
    job_location_state: value.job_location_state,
    job_date: value.job_date,
    job_time: value.job_time,
    job_duration: value.job_duration,
    job_payment: value.job_payment,
    job_notes: value.job_notes,
    job_stayin: value.job_stayin,
  };

  showModal.value = true;
};

// Open Modal Add Job
const openAddModal = () => {
  modalType.value = "add";

  showModalForm.value = {
    job_id: "",
    job_category: "",
    job_title: "",
    job_location_city: "",
    job_location_state: "",
    job_date: "",
    job_time: "",
    job_duration: "",
    job_payment: "",
    job_notes: "",
    job_stayin: "",
  };

  showModal.value = true;
};

// Open Modal Delete Job
const openModalDelete = async (value) => {
  showModalDeleteForm.value.job_id = value.job_id;
  showModalDeleteForm.value.job_title = value.job_title;

  showModalDelete.value = true;
};

const saveJob = async () => {
  const endpoint =
    modalType.value === "edit"
      ? "/api/devtool/care-service/service-list/edit"
      : "/api/devtool/care-service/service-list/add";

  const dataToSave = {
    job_id: showModalForm.value.job_id,
    job_category: parseInt(showModalForm.value.job_category, 10),
    job_location_state: parseInt(showModalForm.value.job_location_state, 10),
    job_duration: showModalForm.value.job_duration
      ? parseInt(showModalForm.value.job_duration, 10)
      : null,
    job_payment: showModalForm.value.job_payment
      ? parseFloat(showModalForm.value.job_payment)
      : null,
    job_stayin: showModalForm.value.job_stayin
      ? parseInt(showModalForm.value.job_stayin, 10)
      : null,
    job_title: showModalForm.value.job_title,
    job_location_city: showModalForm.value.job_location_city,
    job_date: new Date(showModalForm.value.job_date).toISOString(), // Convert to ISO DateTime format
    job_time: showModalForm.value.job_time, // Send as HH:mm or HH:mm:ss format
    job_notes: showModalForm.value.job_notes || "",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const { data } = await useFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(dataToSave),
  });

  if (data.value?.statusCode === 200) {
    $swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: `Job has been ${
        modalType.value === "edit" ? "updated" : "added"
      } successfully`,
      timer: 1000,
      showConfirmButton: false,
    });
    setTimeout(() => {
      $router.go();
    }, 1000);
  } else {
    $swal.fire({
      icon: "error",
      title: "Error",
      text: data.value.message,
    });
  }
};

const deleteJob = async () => {
  const { data } = await useFetch(
    "/api/devtool/care-service/service-list/delete",
    {
      initialCache: false,
      method: "POST",
      body: JSON.stringify({ job_id: showModalDeleteForm.value.job_id }),
    }
  );

  if (data.value.statusCode === 200) {
    $swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: "Job has been deleted",
      timer: 1000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      $router.go();
    }, 1000);
  } else {
    $swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: data.value.message,
    });
  }
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="flex">
          <Icon class="mr-2 flex justify-center" name="ic:outline-info"></Icon>
          Job Info
        </div>
      </template>
      <template #body>
        <p class="mb-4">
          This page is only accessible by admin users. You can manage jobs here.
          You can also add new jobs.
        </p>
      </template>
    </rs-card>

    <rs-card>
      <div class="pt-2">
        <rs-tab fill>
          <rs-tab-item title="All Jobs">
            <div class="flex justify-end items-center mb-4">
              <rs-button @click="openAddModal">
                <Icon name="material-symbols:add" class="mr-1"></Icon>
                Add Job
              </rs-button>
            </div>
            <rs-table
              v-if="jobList && jobList.length > 0"
              :data="jobList"
              :options="{
                variant: 'default',
                striped: true,
                borderless: true,
              }"
              advanced
            >
              <template v-slot:action="data">
                <div class="flex items-center gap-4">
                  <rs-button @click="openModal(data.value)">
                    <Icon
                      name="solar:pen-new-square-broken"
                      class="mr-2 !w-4 !h-4"
                    />
                    Edit
                  </rs-button>
                  <rs-button
                    variant="danger"
                    @click="openModalDelete(data.value)"
                  >
                    <Icon
                      name="material-symbols:delete-sharp"
                      class="mr-2 !w-4 !h-4"
                    />
                    Delete
                  </rs-button>
                  <rs-button @click="navigateToDetails(data.value)">
                    <Icon name="ic:outline-info" class="mr-2 !w-4 !h-4" />
                    Details
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </rs-tab-item>
        </rs-tab>
      </div>
    </rs-card>

    <rs-modal
      :title="modalType == 'edit' ? 'Edit Job' : 'Add Job'"
      v-model="showModal"
      position="center"
      size="lg"
      :overlayClose="false"
    >
      <template v-slot:header>
        {{ modalType == "edit" ? "Edit Job" : "Add Job" }}
      </template>
      <template v-slot:body>
        <form @submit.prevent="saveJob">
          <FormKit
            type="text"
            v-model="showModalForm.job_title"
            label="Job Title"
            validation="required"
          />
          <FormKit
            type="select"
            v-model="showModalForm.job_category"
            label="Job Category"
            :options="jobCategoryOptions"
          />
          <FormKit
            type="text"
            v-model="showModalForm.job_location_city"
            label="Location City"
          />
          <FormKit
            type="select"
            v-model="showModalForm.job_location_state"
            label="Location State"
            :options="jobLocationStateOptions"
          />
          <FormKit
            type="date"
            v-model="showModalForm.job_date"
            label="Job Date"
          />
          <FormKit
            type="time"
            v-model="showModalForm.job_time"
            label="Job Time"
          />
          <FormKit
            type="number"
            v-model="showModalForm.job_duration"
            label="Job Duration (hours)"
          />
          <FormKit
            type="number"
            v-model="showModalForm.job_payment"
            label="Payment"
            step="0.01"
          />
          <FormKit
            type="textarea"
            v-model="showModalForm.job_notes"
            label="Job Notes"
            s
          />
          <FormKit
            type="select"
            v-model="showModalForm.job_stayin"
            label="Stay-in Requirement"
            :options="jobStayinOptions"
          />
        </form>
      </template>
      <template v-slot:footer>
        <rs-button @click="showModal = false">Cancel</rs-button>
        <rs-button @click="saveJob">Save</rs-button>
      </template>
    </rs-modal>

    <!-- Modal Delete Confirmation -->
    <rs-modal
      title="Delete Confirmation"
      ok-title="Yes"
      cancel-title="No"
      :ok-callback="deleteJob"
      v-model="showModalDelete"
    >
      <p>
        Are you sure you want to delete this job ({{
          showModalDeleteForm.job_title
        }})?
      </p>
    </rs-modal>
  </div>
</template>
