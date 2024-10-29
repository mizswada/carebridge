<script setup>
definePageMeta({
  title: "Category Management",
});
const { $swal, $router } = useNuxtApp();

const modalEdit = ref(false);
const modalAdd = ref(false);
const modalDelete = ref(false);
const selectedCategory = ref(null);
const categories = ref(null);
const field = ["name", "description","normalChargesPerHour","proChargesPerHour", "status", "action"];

const editInput = ref("");
const nameInput = ref("");
const descriptionInput = ref("");
const statusInput = ref("");
const chargeInput = ref("");
const prochargeInput = ref("");

// list
const category = await useFetch("/api/care-service/category/list");
if (category.data.value.response == 200) {
  categories.value = category.data.value.data;
} else {
  alert("An error occurred while fetching categories. Please try again.");
}
//add
const closeAdd = () => {
  modalAdd.value = false;
};

// clickAdd
const clickAdd = async () => {
  try {
    const { data: add } = await useFetch(
      "/api/care-service/category/create",
      {
        method: "POST",
        body: JSON.stringify({
          name: nameInput.value,
          description: descriptionInput.value,
          status: statusInput.value,
          charges:chargeInput.value,
          proCharges:prochargeInput.value
        }),
      }
    );

    if (add.value.response === 200) {
      modalAdd.value = false;
      $swal.fire({
        position: "center",
        title: "Success",
        text: add.value.message,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        $router.go();
      }, 1000);
    } else {
      alert("Category failed to create.");
    }
  } catch (error) {
    console.error("Failed to created category", error);
    alert(
      "An error occurred while created category details. Please try again."
    );
  }
};

// edit
const editButton = async (id) => {
  try {
    const { data: detail } = await useFetch(
      "/api/care-service/category/get",
      {
        method: "GET",
        query: {
          id: parseInt(id),
        },
      }
    );

    if (detail.value.response === 200) {
      editInput.value = detail.value.data.category_id;
      nameInput.value = detail.value.data.name;
      descriptionInput.value = detail.value.data.description;
      statusInput.value = detail.value.data.status;
      chargeInput.value=detail.value.data.charges;
      prochargeInput.value=detail.value.data.charges_pro;



      modalEdit.value = true;
    } else {
      alert("Category not found.");
    }
  } catch (error) {
    console.error("Failed to fetch category details:", error);
    alert(
      "An error occurred while fetching category details. Please try again."
    );
  }
};

const closeEdit = () => {
  modalEdit.value = false;
};

const clickUpdate = async () => {
  try {
    const { data: update } = await useFetch(
      "/api/care-service/category/update",
      {
        method: "POST",
        body: JSON.stringify({
          id: editInput.value,
          name: nameInput.value,
          description: descriptionInput.value,
          status: statusInput.value,   
          charges:chargeInput.value,
          proCharges:prochargeInput.value
        }),
      }
    );

    if (update.value.response === 200) {
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
    } else {
      alert("Category failed to update.");
    }
  } catch (error) {
    console.error("Failed to updated category details:", error);
    alert(
      "An error occurred while updated category details. Please try again."
    );
  }
};

//delete
const closeDelete = () => {
  modalDelete.value = false;
};

const confirmDelete = (id) => {
  selectedCategory.value = id;
  modalDelete.value = true;
};

const clickDelete = async () => {
  try {
    const { data: deleted } = await useFetch(
      "/api/care-service/category/delete",
      {
        method: "POST",
        body: JSON.stringify({
          id: selectedCategory.value,
        }),
      }
    );

    if (deleted.value.response === 200) {
      modalDelete.value = false;
      $swal.fire({
        position: "center",
        title: "Success",
        text: deleted.value.message,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        $router.go();
      }, 1000);
    } else {
      alert("Category failed to update.");
    }
  } catch (error) {
    console.error("Failed to updated category details:", error);
    alert(
      "An error occurred while updated category details. Please try again."
    );
  }
  categories.value = categories.value.filter(
    (category) => category.id !== selectedCategory.value.id
  );
  modalDelete.value = false;
  selectedCategory.value = null;
};
</script>

<template>
 
  <div class="space-y-8">
    <div class="text-lg font-semibold">Category Management</div>
    <br />

    <!-- Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
      <!-- Summary Card #1 -->
      <rs-card>
        <div class="summary-2 pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-indigo-100 rounded-2xl"
          >
            <Icon
              class="text-indigo-500"
              name="material-symbols:category"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-semibold text-xl leading-tight">
              {{ categories.length }}</span
            >
            <span class="text-base font-semibold text-gray-500">
              Total Categories
            </span>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- List of categories -->
    <div class="pb-20">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-lg font-medium mb-4">List of Categories</div>
        <div class="flex justify-end items-center mb-3 gap-5">
          <rs-button variant="primary" @click="modalAdd = true">
            <Icon name="solar:add-square-broken" class="mr-2" /> Add Category
          </rs-button>
          <rs-modal
            title="Add Category"
            v-model="modalAdd"
            size="lg"
            position="center"
            :overlayClose="false"
          >
            <template v-slot:header> Add Category </template>
            <template v-slot:body>
              <form @submit.prevent="submitCategory">
                <FormKit type="text" label="Name" v-model="nameInput" />
                <FormKit
                  type="textarea"
                  v-model="descriptionInput"
                  placeholder="Category Details"
                  rows="5"
                  label="Details"
                />
                <FormKit type="number" label="Charge per hour (Normal)" v-model="chargeInput" />
                <FormKit type="number" label="Charge per hour (Pro)" v-model="prochargeInput" />

                <FormKit
                  type="select"
                  label="Status"
                  v-model="statusInput"
                  :options="[
                    { value: '', label: 'Please choose Status' },
                    { value: 'Enabled', label: 'Enabled' },
                    { value: 'Disabled', label: 'Disabled' },
                  ]"
                />
              </form>
            </template>
            <template v-slot:footer>
              <rs-button @click="closeAdd">Cancel</rs-button>
              <rs-button @click="clickAdd">Add</rs-button>
            </template>
          </rs-modal>
        </div>

        <rs-table
          :data="categories"
          :options="{
            variant: 'default',
            striped: true,
            borderless: true,
          }"
          :field="field"
          :options-advanced="{
            sortable: true,
            responsive: true,
            filterable: false,
          }"
          advanced
        >
          <template #name="categories">
            {{ categories.value.name }}
          </template>
          <template #description="categories">
            {{ categories.value.description }}
          </template>
          <template #normalChargesPerHour="categories">
            RM {{ categories.value.charges }}
          </template>
          <template #proChargesPerHour="categories">
            RM {{ categories.value.charges_pro }}
          </template>
          <template #status="categories">
            {{ categories.value.status }}
          </template>
          <template #action="categories">
            <div class="flex items-center gap-4">
              <rs-button @click="editButton(categories.value.category_id)">
                <Icon
                  name="solar:pen-new-square-broken"
                  class="mr-2 !w-4 !h-4"
                />
                Edit
              </rs-button>
              <rs-modal
                title="Edit Category"
                v-model="modalEdit"
                position="center"
                size="lg"
                :overlayClose="false"
              >
                <template v-slot:header> Edit Category </template>
                <template v-slot:body>
                  <form @submit.prevent="submitCategory">
                    <FormKit type="text" label="Name" v-model="nameInput" />
                    <FormKit
                      type="textarea"
                      v-model="descriptionInput"
                      placeholder="Category Details"
                      rows="5"
                      label="Details"
                    />

                    <FormKit type="number" label="Charge per hour (Normal)" v-model="chargeInput" />
                    <FormKit type="number" label="Charge per hour (Pro)" v-model="prochargeInput" />

                    <FormKit
                      type="select"
                      label="Status"
                      v-model="statusInput"
                      :options="[
                        { value: '', label: 'Please choose Status' },
                        { value: 'Enabled', label: 'Enabled' },
                        { value: 'Disabled', label: 'Disabled' },
                      ]"
                    />
                  </form>
                </template>
                <template v-slot:footer>
                  <rs-button @click="closeEdit">Cancel</rs-button>
                  <rs-button @click="clickUpdate">Update</rs-button>
                </template>
              </rs-modal>
              <rs-button
                variant="danger"
                @click="confirmDelete(categories.value.category_id)"
              >
                <Icon
                  name="material-symbols:delete-sharp"
                  class="mr-2 !w-4 !h-4"
                />
                Delete
              </rs-button>
            </div>
          </template>
        </rs-table>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Confirm Deletion"
      v-model="modalDelete"
      size="md"
      position="center"
    >
      <template v-slot:header> Confirm Deletion </template>
      <template v-slot:body>
        Are you sure you want to delete this category?
      </template>
      <template v-slot:footer>
        <rs-button @click="closeDelete">Cancel</rs-button>
        <rs-button @click="clickDelete">Delete</rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<style lang="scss" scoped></style>
