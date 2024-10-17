<template>
  <div>
    <h2>Equipment Management</h2>

    <!-- Equipment Form -->
    <form @submit.prevent="saveEquipment">
      <input v-model="formData.id" type="hidden" />

      <!-- Equipment Name -->
      <FormKit
        type="text"
        label="Equipment Name:"
        v-model="formData.equipmentname"
        required
      />

      <!-- Description -->
      <FormKit
        type="text"
        label="Description:"
        v-model="formData.description"
        required
      />

      <!-- Type -->
      <FormKit
        type="text"
        label="Type:"
        v-model="formData.type"
        required
      />

      <!-- Price -->
      <FormKit
        type="number"
        label="Price:"
        v-model="formData.price"
        required
        step="0.01"
      />

      <!-- Rent Type -->
      <FormKit
        type="text"
        label="Rent Type:"
        v-model="formData.rent_type"
        required
      />

      <!-- Rent Period -->
      <FormKit
        type="text"
        label="Rent Period:"
        v-model="formData.rent_period"
        required
      />

      <!-- Rent Start Date -->
      <FormKit
        type="date"
        label="Rent Start Date:"
        v-model="formData.rent_sdate"
        required
      />

      <!-- Rent End Date -->
      <FormKit
        type="date"
        label="Rent End Date:"
        v-model="formData.rent_edate"
        required
      />

      <!-- PIC Name -->
      <FormKit
        type="text"
        label="PIC Name:"
        v-model="formData.pic_name"
        required
      />

      <!-- PIC Phone Number -->
      <FormKit
        type="mask"
        label="PIC Phone Number (012-34567890):"
        mask="###-########"
        v-model="formData.pic_phone"
        required
      />

      <!-- Number Status -->
      <FormKit
        type="text"
        label="Number Status:"
        v-model="formData.number_status"
        required
      />

      <!-- Created At -->
      <FormKit
        type="datetime-local"
        label="Created At:"
        v-model="formData.created_at"
        required
      />

      <!-- Updated At -->
      <FormKit
        type="datetime-local"
        label="Updated At:"
        v-model="formData.updated_at"
        required
      />

      <!-- Deleted At -->
      <FormKit
        type="datetime-local"
        label="Deleted At:"
        v-model="formData.deleted_at"
      />

      <!-- Submit Button -->
      <button type="submit">Save</button>
      <button type="button" @click="resetForm" v-if="formData.id">Cancel Edit</button>
    </form>

    <!-- Equipment List -->
    <h3>Equipment List</h3>
    <ul>
      <li v-for="equipment in equipments" :key="equipment.id">
        <strong>{{ equipment.equipmentname }}</strong> - {{ equipment.description }}
        <button @click="editEquipment(equipment)">Edit</button>
        <button @click="confirmDelete(equipment.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// State for form data and equipment list
const formData = ref({
  id: null,
  equipmentname: '',
  description: '',
  type: '',
  price: '',
  rent_type: '',
  rent_period: '',
  rent_sdate: '',
  rent_edate: '',
  pic_name: '',
  pic_phone: '',
  number_status: '',
  created_at: '',
  updated_at: '',
  deleted_at: ''
});

const equipments = ref([]);

// Fetch all equipments from the database
const fetchEquipments = async () => {
  try {
    const response = await fetch('/api/equipments'); // Adjust the API path
    if (response.ok) {
      equipments.value = await response.json();
    } else {
      console.error('Failed to fetch equipment data');
    }
  } catch (error) {
    console.error('Error fetching equipment data:', error);
  }
};

// Save or update equipment
const saveEquipment = async () => {
  try {
    const method = formData.value.id ? 'PUT' : 'POST';
    const url = formData.value.id ? `/api/equipments/${formData.value.id}` : '/api/equipments';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    });

    if (response.ok) {
      resetForm();
      fetchEquipments();
    } else {
      console.error('Failed to save equipment');
    }
  } catch (error) {
    console.error('Error saving equipment data:', error);
  }
};

// Load equipment data into the form for editing
const editEquipment = (equipment) => {
  formData.value = { ...equipment };
};

// Confirm and delete equipment from the database
const confirmDelete = (id) => {
  if (confirm("Are you sure you want to delete this equipment?")) {
    deleteEquipment(id);
  }
};

const deleteEquipment = async (id) => {
  try {
    const response = await fetch(`/api/equipments/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchEquipments();
    } else {
      console.error('Failed to delete equipment');
    }
  } catch (error) {
    console.error('Error deleting equipment:', error);
  }
};

// Reset form data after save or cancel
const resetForm = () => {
  formData.value = {
    id: null,
    equipmentname: '',
    description: '',
    type: '',
    price: '',
    rent_type: '',
    rent_period: '',
    rent_sdate: '',
    rent_edate: '',
    pic_name: '',
    pic_phone: '',
    number_status: '',
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
};

// Fetch data when component is mounted
onMounted(fetchEquipments);
</script>

<style scoped>
form {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 10px;
}

button {
  margin-top: 10px;
  margin-right: 5px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
