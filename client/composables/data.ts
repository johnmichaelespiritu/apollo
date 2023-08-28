// Defines the structure of a launch object
export interface Launch {
  id: string;
  mission_id: string;
  launch_date_local: string;
  launch_site: {
    site_name: string;
  };
  rocket: {
    rocket_name: string;
  };
  details: string;
}

// Defines the structure of a query result containing an array of launches
export interface QueryResult {
  launches: Launch[];
}

/**
 * Applies a filter to the list of launches based on the selected launch year.
 *
 * @param launches - The list of launches to be filtered.
 * @param selectedYear - The selected launch year for filtering.
 * @returns An object containing the filtered launches.
 */
export const useLaunchYearFilter = (
  launches: Ref<Launch[]>,
  selectedYear: Ref<string>
) => {
  const filteredLaunches = computed(() => {
    if (!selectedYear.value) {
      return launches.value;
    }
    return launches.value.filter((launch) => {
      const launchYear = new Date(launch.launch_date_local).getFullYear();
      return launchYear.toString() === selectedYear.value;
    });
  });

  return {
    filteredLaunches,
  };
};

/**
 * Sorts the list of launches based on the selected sorting order.
 *
 * @param launches - The list of launches to be sorted.
 * @param selectedSort - The selected sorting order ("Ascending" or "Descending").
 * @returns An object containing the sorted launches.
 */
export const useLaunchYearSort = (
  launches: Ref<Launch[]>,
  selectedSort: Ref<string>
) => {
  const sortedLaunches = computed(() => {
    const sortedArray = [...launches.value];
    if (selectedSort.value === "Ascending") {
      sortedArray.sort((a, b) => {
        return (
          new Date(a.launch_date_local).getFullYear() -
          new Date(b.launch_date_local).getFullYear()
        );
      });
    } else if (selectedSort.value === "Descending") {
      sortedArray.sort((a, b) => {
        return (
          new Date(b.launch_date_local).getFullYear() -
          new Date(a.launch_date_local).getFullYear()
        );
      });
    }
    return sortedArray;
  });

  return {
    sortedLaunches,
  };
};

/**
 * Retrieves and processes all launch data, including filtering by selected year.
 *
 * @param selectedYear - The selected launch year for filtering.
 * @returns An object containing the launches data, including filtered launches.
 */
export const useAllLaunchData = (selectedYear: Ref<string>) => {
  const query = gql`
    query getLaunches {
      launches {
        id
        mission_id
        mission_name
        launch_date_local
        launch_site {
          site_name
        }
        rocket {
          rocket_name
        }
        details
      }
    }
  `;

  // Use AsyncQuery to fetch data based on the GraphQL query
  const { data } = useAsyncQuery<QueryResult>({
    query,
  });

  /**
   * Formats the raw date string into a human-readable format.
   *
   * @param rawDate - The raw date string to be formatted.
   * @returns The formatted date string.
   */
  const formatDate = (rawDate: string): string => {
    const date = new Date(rawDate);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Process and format the launches data
  const launches = computed<Launch[]>(() => {
    return (
      data.value?.launches.map((launch: Launch) => ({
        ...launch,
        launch_date_local: formatDate(launch.launch_date_local),
      })) ?? []
    );
  });

  // Apply launch year filter to the launches data
  const { filteredLaunches } = useLaunchYearFilter(launches, selectedYear);

  return {
    launches: filteredLaunches,
  };
};
