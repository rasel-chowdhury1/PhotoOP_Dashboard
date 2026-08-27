import ReusableTable, { Column, FooterCell } from "@/Components/ui/CustomUi/ReuseableTable";
import { useState } from "react";

interface Invoice {
    invoice: string;
    paymentStatus: "Paid" | "Pending" | "Unpaid";
    totalAmount: number;
    user: {
        name: string;
        email: string;
        phone: string;
    }
    paymentMethod: string;
}
const invoices: Invoice[] = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: 250.00,
        user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: 150.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: 350.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: 450.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: 550.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Unpaid",
        totalAmount: 650.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Paid",
        totalAmount: 750.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV008",
        paymentStatus: "Pending",
        totalAmount: 850.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV009",
        paymentStatus: "Unpaid",
        totalAmount: 950.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV010",
        paymentStatus: "Paid",
        totalAmount: 1050.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV011",
        paymentStatus: "Paid",
        totalAmount: 1150.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV012",
        paymentStatus: "Unpaid",
        totalAmount: 1250.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV013",
        paymentStatus: "Paid",
        totalAmount: 1350.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV014",
        paymentStatus: "Pending",
        totalAmount: 1450.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV015",
        paymentStatus: "Unpaid",
        totalAmount: 1550.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV016",
        paymentStatus: "Paid",
        totalAmount: 1650.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV017",
        paymentStatus: "Paid",
        totalAmount: 1750.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV018",
        paymentStatus: "Unpaid",
        totalAmount: 1850.00, user: {
            name: "John Doe",
            email: "qg0yM@example.com",
            phone: "(123) 456-7890",
        },
        paymentMethod: "Bank Transfer",
    },
];
export default function TableDemo() {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const total = invoices.length;

    const paginateData = () => {
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        return invoices.slice(startIndex, endIndex);
    };


    const columns: Column<Invoice>[] = [
        {
            header: "Invoice",
            accessorKey: "invoice",
            headerClassName: "!bg-background",
            cellClassName: "font-medium !bg-background",
            fixed: true,
            width: 100

        },
        {
            header: "Status",
            accessorKey: "paymentStatus",
            render: (value: string) => {
                const colors: Record<string, string> = {
                    Paid: "text-green-600 bg-green-50",
                    Pending: "text-yellow-600 bg-yellow-50",
                    Unpaid: "text-red-600 bg-red-50",
                };
                return (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[value]}`}>
                        {value}
                    </span>
                );
            },
        },
        {
            header: "Method",
            accessorKey: "paymentMethod",
            width: 100,
        },
        {
            header: "User Name",
            accessorKey: "user",
            render: (value: { name: string }) => value.name,
        },
        {
            header: "User Email",
            accessorKey: "user",
            render: (value: { email: string }) => value.email,
        },
        {
            header: "User Phone",
            accessorKey: "user",
            render: (value: { phone: string }) => value.phone,
        },
        {
            header: "Amount",
            accessorKey: "totalAmount",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (value: number) => `$${value.toFixed(2)}`,
        },
    ];

    const footer: FooterCell[] = [
        {
            content: "Total",
            colSpan: 6,
        },
        {
            content: `$${paginateData().reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}`,
            className: "text-right font-semibold",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Reusable Table Demo</h1>

                    <ReusableTable<Invoice>
                        data={paginateData()}
                        columns={columns}
                        caption="A list of your recent invoices."
                        footer={footer}
                        pagination={true}
                        currentPage={currentPage}
                        setCurrentPage={(page) => setCurrentPage(page)}
                        limit={limit}
                        total={total}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Usage Example:</h2>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                        {`interface Invoice {
  invoice: string;
  paymentStatus: "Paid" | "Pending" | "Unpaid";
  totalAmount: number;
  paymentMethod: string;
}

const columns: Column<Invoice>[] = [
  {
    header: "Invoice",
    accessorKey: "invoice",
    headerClassName: "w-[100px]",
    cellClassName: "font-medium",
  },
  {
    header: "Status",
    accessorKey: "paymentStatus",
    render: (value: string) => (
      <span className="badge">{value}</span>
    ),
  },
  {
    header: "Amount",
    accessorKey: "totalAmount",
    headerClassName: "text-right",
    cellClassName: "text-right",
    render: (value: number) => \`$\${value.toFixed(2)}\`,
  },
];

const footer: FooterCell[] = [
  { content: "Total", colSpan: 3 },
  { content: "$2,500.00", className: "text-right" },
];

<ReusableTable<Invoice>
  data={invoices}
  columns={columns}
  caption="A list of your recent invoices."
  footer={footer}
  onRowClick={(row) => console.log(row)}
/>`}
                    </pre>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">TypeScript Interfaces:</h2>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>ReusableTableProps{'<T>'}:</strong> Main component props with generic type T</li>
                        <li><strong>Column{'<T>'}:</strong> Column definition with header, accessorKey, optional render, and className options</li>
                        <li><strong>FooterCell:</strong> Footer cell with content, colSpan, and className</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}