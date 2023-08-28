<template>
  <v-container>
    <!-- Page Title -->
    <h1 class="d-flex justify-center">SpaceX Launches</h1>

    <!-- Launch Data Table -->
    <v-data-table
      class="my-5 elevation-1"
      :headers="tableHeaders"
      :items="sortedLaunches"
      item-key="id"
    >
      <!-- Filters and Sort Controls -->
      <template v-slot:top>
        <div class="d-flex justify-space-between w-50">
          <!-- Launch Year Filter -->
          <v-select
            clearable
            label="Select Launch Year"
            variant="outlined"
            v-model="selectedYear"
            :items="yearOptions"
          ></v-select>

          <div class="mx-2"></div>

          <!-- Launch Year Sort -->
          <v-select
            clearable
            label="Sort Launch Year"
            variant="outlined"
            v-model="selectedSort"
            :items="['Ascending', 'Descending']"
          ></v-select>
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts" setup>
// Set the page title
useHead({ title: "SpaceX" });

// Reactive variables
const selectedYear = ref("");
const selectedSort = ref("");

// Table headers configuration
const tableHeaders = ref([
  {
    title: "Mission Name",
    align: "center",
    key: "mission_name",
    sortable: false,
  },
  {
    title: "Launch Date",
    align: "center",
    key: "launch_date_local",
    sortable: false,
  },
  {
    title: "Launch Site Name",
    align: "center",
    key: "launch_site.site_name",
    sortable: false,
  },
  {
    title: "Rocket Name",
    align: "center",
    key: "rocket.rocket_name",
    sortable: false,
  },
  {
    title: "Details",
    align: "center",
    key: "details",
    sortable: false,
  },
]);

// Calculate available launch years for filtering
const currentYear = new Date().getFullYear();
const startYear = 2006;
const yearRange = currentYear - startYear + 1;
const yearOptions = Array.from({ length: yearRange }, (_, index) => {
  const year = currentYear - index;
  return year.toString();
});

// Fetch all launch data
const { launches } = useAllLaunchData(selectedYear);

// Apply launch year filter
const { filteredLaunches } = useLaunchYearFilter(launches, selectedYear);

// Apply launch year sort
const { sortedLaunches } = useLaunchYearSort(filteredLaunches, selectedSort);
</script>
