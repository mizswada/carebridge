<template>
  <div>
    <h1>Emergency Contacts</h1>

    <!-- Add Contact Button -->
    <div class="flex justify-end items-center mb-4">
      <rs-button @click="openModalContact(null, 'add')">
        <Icon name="material-symbols:add" class="mr-1"></Icon>
        Add Contact
      </rs-button>
    </div>

    <!-- Contacts Table -->
    <rs-table
      v-if="contactList && contactList.length > 0"
      :data="contactList"
      :field="field"
      :options="{
        variant: 'default',
        striped: true,
        borderless: true,
      }"
      advanced>
    
    <template v-slot:Name="data">
      {{ data.value.contact_name }}
    </template>
    

    <template v-slot:Relationship="data">
    {{ data.value.contact_relationship }}
    </template>

    <template v-slot:PhoneNumber="data">
    {{ data.value.contact_phone_number }}
    </template>

   
      <template v-slot:Action="data">
        <div class="flex justify-center items-center">
          <!-- Edit Button -->
          <rs-button variant="primary-text" @click="openModalContact(data.value, 'edit')">
            <Icon
              name="material-symbols:edit-outline-rounded"
              class="text-primary hover:text-primary/90 cursor-pointer mr-1"
              size="22"
            ></Icon>
          </rs-button>

          <!-- Delete Button -->
          <rs-button variant="primary-text" @click="openModalDelete(data.value)">
            <Icon
              name="material-symbols:close-rounded"
              class="text-primary hover:text-primary/90 cursor-pointer mr-1"
              size="22"
            ></Icon>
          </rs-button>
        </div>
      </template>
    </rs-table>

    <!-- Modal Add/Edit Contact -->
    <rs-modal
      :title="modalType === 'edit' ? 'Edit Contact' : 'Add Contact'"
      ok-title="Save"
      cancel-title="Cancel"
      :cancel-callback="() => showModalContact.value = false"
      :ok-callback="saveContact"
      v-model="showModalContact"
    >
      <!-- Form fields -->
      <form class="modal-form">
        <!-- User Full Name Dropdown -->
        <div class="form-group">
          <label for="userFullName">User Full Name</label>
          <select v-model="showModalContactForm.contact_user_id" class="form-control" id="userFullName" required>
            <option v-for="user in userList" :key="user.value" :value="user.value">{{ user.label }}</option>
          </select>
        </div>

        <!-- Contact Name Input -->
        <div class="form-group">
          <label for="contactName">Contact Name</label>
          <input 
            v-model="showModalContactForm.contact_name" 
            type="text" 
            class="form-control" 
            id="contactName" 
            placeholder="Enter contact name" 
            required 
          />
        </div>

<!-- Relationship Dropdown -->
<div class="form-group">
  <label for="relationship">Relationship</label>
  <select 
    v-model="showModalContactForm.contact_relationship" 
    class="form-control" 
    id="relationship" 
    required
  >
    <!-- Use lookupValue directly -->
    <option v-for="relationship in relationshipOptions" :key="relationship.lookupID" :value="relationship.lookupID ">
      {{ relationship.lookupValue }}
    </option>
  </select>
</div>


        <!-- Phone Number Input -->
        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input 
            v-model="showModalContactForm.contact_phone_number" 
            type="text" 
            class="form-control" 
            id="phoneNumber" 
            placeholder="Enter phone number" 
            required 
          />
        </div>
      </form>
    </rs-modal>

    <!-- Modal Delete Confirmation -->
    <rs-modal
      title="Delete Confirmation"
      ok-title="Yes"
      cancel-title="No"
      :ok-callback="deleteContact"
      v-model="showModalDelete"
    >
      <p>Are you sure you want to delete this contact ({{ showModalDeleteForm.contact_name }})?</p>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

// This part already exists
const { $swal } = useNuxtApp();
const contactList = ref([]);
const userList = ref([]);
const relationshipOptions = ref([]);  // For relationship dropdown
const showModalContact = ref(false);
const showModalDelete = ref(false);
const modalType = ref("add");
const field=['Name', 'Relationship', 'Phone Number', 'Action'];

const showModalContactForm = ref({
  contact_id: "",
  contact_user_id: "",  // Store userID here
  contact_name: "",
  contact_relationship: "",  // Store relationship here
  contact_phone_number: "",
});

const showModalDeleteForm = ref({
  contact_id: "",
  contact_name: "",
});

// Fetch emergency contacts and users on component mount
onMounted(async () => {
  await getContactList();
  await getUserList();
  await getRelationshipOptions(); // Fetch relationship options
});

// Fetch the list of contacts
async function getContactList() {
  const { data } = await useFetch("/api/contact/list", { initialCache: false });

  console.log(data.value)
  if (data.value?.statusCode === 200) {
    contactList.value = data.value.data.map((contact) => ({
      contact_id: contact.contact_id,
      contact_user_id: contact.contact_user_id,
      contact_name: contact.user.userUsername,
      contact_relationship: contact.lookup.lookupValue,
      contact_phone_number: contact.contact_phone_number,
      created_at: contact.created_at,
      updated_at: contact.updated_at,
      deleted_at: contact.deleted_at,
      action: contact,
    }));
  }
}

// Fetch the list of users for the dropdown (User Full Name)
async function getUserList() {
  const { data } = await useFetch("/api/devtool/user/list", { initialCache: false });

  if (data.value?.statusCode === 200) {
    userList.value = data.value.data.map((user) => ({
      label: user.userFullName,
      value: user.userID,
    }));
  }
}

// Fetch the list of relationship options from lookup table
async function getRelationshipOptions() {
  const { data } = await useFetch('/api/devtool/lookup/list', {
    params: { lookupType: 'contact_relationship' }, // Ensure correct filter for contact_relationship
    initialCache: false,
  });

  if (data.value?.statusCode === 200) {
    relationshipOptions.value = data.value.data.map((lookupItem) => ({
      lookupValue: lookupItem.lookupValue,  // We only need lookupValue for the dropdown
    }));
  }
}

// Open modal for Add/Edit contact
const openModalContact = (contact = null, type = "add") => {
  modalType.value = type;

  if (type === "edit" && contact) {
    // Pre-fill form for editing
    showModalContactForm.value = {
      contact_id: contact.contact_id,
      contact_user_id: contact.contact_user_id,  // Store the user ID
      contact_name: contact.contact_name,
      contact_relationship: contact.contact_relationship,
      contact_phone_number: contact.contact_phone_number,
    };
  } else {
    // Reset form when adding a new contact
    showModalContactForm.value = {
      contact_id: "",
      contact_user_id: "",
      contact_name: "",
      contact_relationship: "",
      contact_phone_number: "",
    };
  }

  showModalContact.value = true;
};

// Save contact (Add/Edit)
const saveContact = async () => {
  if (!showModalContactForm.value.contact_user_id || !showModalContactForm.value.contact_name  || !showModalContactForm.value.contact_relationship || !showModalContactForm.value.contact_phone_number) {
    $swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: 'Please fill out all required fields.',
    });
    return;
  }

  const contactData = {
    contact_id: showModalContactForm.value.contact_id,
    contact_user_id: showModalContactForm.value.contact_user_id,
    contact_name: showModalContactForm.value.contact_name,
    contact_relationship: showModalContactForm.value.contact_relationship,
    contact_phone_number: showModalContactForm.value.contact_phone_number,
  };

  const method = modalType.value === 'edit' ? 'PUT' : 'POST';
  const url = modalType.value === 'edit' ? `/api/contact/edit/${contactData.contact_id}` : '/api/contact/add';

  const { data } = await useFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });

  if (data.value?.statusCode === 200) {
    $swal.fire({
      position: 'center',
      icon: 'success',
      title: modalType.value === 'edit' ? 'Contact updated!' : 'Contact added!',
      timer: 1000,
      showConfirmButton: false,
    });
    showModalContact.value = false;
    await getContactList();
  } else {
    $swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: data.value?.message,
    });
  }
};

// Open modal to confirm delete
const openModalDelete = (contact) => {
  showModalDeleteForm.value = {
    contact_id: contact.contact_id,
    contact_name: contact.contact_name,
  };
  showModalDelete.value = true;
};

// Delete contact
const deleteContact = async () => {
  const { data } = await useFetch(`/api/contact/delete/${showModalDeleteForm.value.contact_id}`, { method: 'DELETE' });

  if (data.value?.statusCode === 200) {
    $swal.fire({
      icon: "success",
      title: "Contact deleted successfully!",
    });
    showModalDelete.value = false;
    await getContactList();
  } else {
    $swal.fire({
      icon: "error",
      title: "Error",
      text: data.value?.message,
    });
  }
};
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.modal-form label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
</style>
