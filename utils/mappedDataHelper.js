import { format } from "date-fns";

/**
 * General-purpose mapper for data table rows.
 * @param {Array} rawData - Raw data from DB (e.g., Prisma).
 * @param {Array} formatConfig - Defines how each field should be transformed.
 * @param {String} context - Optional string to handle conditional mapping.
 * @returns {Array} - Formatted data ready for table use.
 */

export const mappedDataConstructor = (rawData, formatConfig) => {
  return rawData.map((item) => {
    const mapped = { key: item.id || item.key };
    if (item.productInvoices) mapped.productInvoices = item.productInvoices;
    formatConfig.forEach(({ key, dataIndex, type, customFn }) => {
      let value;

      if (customFn) {
        value = customFn(item);
      } else {
        value = item[dataIndex];

        if (type === "date" && value) {
          value = format(new Date(value), "yyyy-MM-dd HH:mm:ss");
        }

        if (type === "string" && value === null) {
          value = "N/A";
        }
      }

      mapped[key] = value;
    });

    return mapped;
  });
};
