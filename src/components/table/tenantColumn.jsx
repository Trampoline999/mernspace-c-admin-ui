export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => {
      const id = getValue();
      return id;
    }
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => {
      const name = getValue();
      return name;
    }
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ getValue }) => {
      const address = getValue();
      return address;
    },
  },
];
