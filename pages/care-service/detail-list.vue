<template>
  <div>
    <h1 v-if="jobData">{{ jobData.job_title }}</h1>
    <h2 v-if="jobId" class="subtitle">Job ID: {{ jobId }}</h2>
    <section v-if="jobData" class="job-details">
      <p>{{ jobData.description }}</p>
      <!-- Display other job details here -->
    </section>
    <section v-else>
      <p>Loading...</p>
    </section>

    <section class="info-box">
      <h2>Rating</h2>
      <p>Rating content goes here...</p>
    </section>

    <section class="info-box">
      <h2>Complaints</h2>
      <p>Complaints content goes here...</p>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useFetch } from "#app";

const route = useRoute();
const jobId = ref(route.query.id);
const jobData = ref(null);

onMounted(async () => {
  if (jobId.value) {
    const { data, error } = await useFetch(
      "/api/devtool/care-service/service-list/list"
    );

    if (data.value?.statusCode === 200) {
      const allJobs = data.value.data;
      jobData.value = allJobs.find(
        (job) => job.job_id === parseInt(jobId.value, 10)
      );

      if (!jobData.value) {
        console.error("Job not found");
      }
    } else {
      console.error("Failed to fetch jobs:", error.value);
    }
  }
});
</script>

<style scoped>
h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 0;
}

.subtitle {
  font-size: 16px;
  color: #888;
  margin-top: 4px;
  margin-bottom: 20px;
}

.job-details {
  font-size: 18px;
  color: #555;
  margin-bottom: 20px;
}

.info-box {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 20px;
  color: #666;
}

section {
  margin-top: 20px;
}
</style>
