
export const transformAttributesToSchema = <T extends Record<string, any>>(
    attributes: any
  ): T => {
    return Object.fromEntries(
      Object.entries(attributes).map(([key, value]: [string, any]) => {
        // Extracting the type key from Sequelize's data type
        const typeKey = value.type.constructor
          ? value.type.constructor.key
          : "UNKNOWN";
  
        // Handle the case where 'STRING' type is used (change it to 'TEXT' for PostgreSQL)
        if (typeKey === "STRING") {
          value.type = "TEXT"; // You can also use 'VARCHAR' if needed
        }
  
        return [
          key,
          {
            ...value,
            type: typeKey, // Use the extracted type key
          },
        ];
      })
    ) as T; // Ensure TypeScript knows the return type is T
  };