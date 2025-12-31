import { useAppResourceInfoStore } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const appResourceStore = useAppResourceInfoStore();
  const appResourceState = appResourceStore.$state;
  const { data } = useAuth();
  return {
    provide: {
      apiBaseUrl,
      appResourceState,
      appResourceStore,
      getType: (value: any) => {
        const typeStr = typeof value;

        // Handle special cases for more precise typing
        if (typeStr === "object") {
          if (value === null) {
            return "null";
          } else if (Array.isArray(value)) {
            return "array";
          } else if (value instanceof Date) {
            return "date";
          } else if (value instanceof RegExp) {
            return "regexp";
          } else {
            return "object";
          }
        } else {
          return typeStr;
        }
      },
      getAdmin: () => {
        if (data) {
          return { ...data.value };
        }
        return null;
      },
      formatDate: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const newDate = new Date(inputDate);
        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "short",
          year: "numeric",
        };
        const formattedDate = new Intl.DateTimeFormat("en-NG", options).format(
          newDate
        );
        return formattedDate;
      },
      formatTableDate: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const addOrdinalSuffix = (day: number) => {
          if (day >= 11 && day <= 13) {
            return `${day}th`;
          }
          switch (day % 10) {
            case 1:
              return `${day}st`;
            case 2:
              return `${day}nd`;
            case 3:
              return `${day}rd`;
            default:
              return `${day}th`;
          }
        };
        const newDate = new Date(inputDate);
        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "short",
          year: "numeric",
        };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          newDate
        );

        // Extract day, month, and year
        const day = newDate.getDate();
        const month = formattedDate.split(" ")[0];
        const year = formattedDate.split(" ")[2];

        // Add ordinal suffix to the day
        const dayWithOrdinal = addOrdinalSuffix(day);

        // Concatenate the formatted date
        const result = `${month} ${dayWithOrdinal}, ${year}`;

        return result;
      },
      formatDateSimple: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const dates = new Date(inputDate);
        const year = dates.getFullYear();
        const month = String(dates.getMonth() + 1).padStart(2, "0");
        const day = String(dates.getDate()).padStart(2, "0");

        return `${month}-${day}-${year}`;
      },
      formatDateSimple2: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const dates = new Date(inputDate);
        const year = dates.getFullYear();
        const month = String(dates.getMonth() + 1).padStart(2, "0");
        const day = String(dates.getDate()).padStart(2, "0");

        return `${month}/${day}/${year}`;
      },
      formatDateTime: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };

        const formattedDate = new Intl.DateTimeFormat("en-NG", options).format(
          new Date(inputDate)
        );
        // inputDate.toLocaleString("en-US", options);
        const parts = formattedDate.split(" ");

        return `${parts[0]} ${parts[1]}, ${parts[2]}. ${parts[3]} ${parts[4]} ${parts[5]}`;
      },
    },
  };
});
