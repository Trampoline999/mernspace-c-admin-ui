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
    accessorKey: "username",
    header: "Username",
    accessorFn: (row) => `${row.firstName} ${row.lastName}` || "-",
    cell: ({ getValue }) => {
      const name = getValue();
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : "-";
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue();
      return role ? role.charAt(0).toUpperCase() + role.slice(1) : "-";
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "createdAt",
    accessorFn: (row) => row.createdAt || row["created at"] || "",
    header: "Created at",
    cell: ({ getValue }) => {
      const val = getValue();
      if (!val) return "-";
      try {
        const date = new Date(val);
        return isNaN(date.getTime()) ? val : date.toLocaleDateString();
      } catch {
        return val;
      }
    },
  },
];
