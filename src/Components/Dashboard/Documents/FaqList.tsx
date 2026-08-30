import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { useDeleteFaqMutation, useGetFaqsByRoleQuery } from "@/redux/features/faq/faqApi";
import FaqSheet from "./FaqSheet";

interface FaqListProps {
  role: FaqRole;
}

const FaqList = ({ role }: FaqListProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isFetching } = useGetFaqsByRoleQuery(
    { role, page: currentPage, limit, searchTerm: search || undefined, sort: "createdAt" },
    { refetchOnMountOrArgChange: true }
  );

  const faqs = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IFaq | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<IFaq | null>(null);

  const [deleteFaq] = useDeleteFaqMutation();

  const handleAddNew = () => {
    setEditRecord(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (faq: IFaq) => {
    setEditRecord(faq);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditRecord(null);
  };

  const handleDeleteClick = (faq: IFaq) => {
    setDeleteRecord(faq);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async (faq: IFaq) => {
    await tryCatchWrapper(deleteFaq, { params: { id: faq._id } }, "Deleting FAQ...");
    setIsDeleteOpen(false);
    setDeleteRecord(null);
  };

  const columns: Column<IFaq>[] = [
    {
      header: "Question",
      accessorKey: "question",
      cellClassName: "font-medium",
    },
    {
      header: "Answer",
      accessorKey: "answer",
      width: 420,
      render: (value: string) => (
        <span className="whitespace-pre-wrap text-muted-foreground">{value}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      render: (value: boolean) => (
        <Tag theme={value ? "success" : "error"}>{value ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      header: "Action",
      accessorKey: "_id",
      render: (_: unknown, record: IFaq) => (
        <div className="flex items-center gap-3">
          <ReusableTooltip content="Edit">
            <Pencil
              onClick={() => handleEdit(record)}
              className="size-4.5 text-amber-500 cursor-pointer"
            />
          </ReusableTooltip>
          <ReusableTooltip content="Delete">
            <Trash2
              onClick={() => handleDeleteClick(record)}
              className="size-4.5 text-destructive cursor-pointer"
            />
          </ReusableTooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <ReuseSearchInput
          className="min-w-96"
          placeholder="Search by question..."
          setSearch={setSearch}
          setPage={setCurrentPage}
        />
        <Button onClick={handleAddNew}>+ Add FAQ</Button>
      </div>

      <ReusableTable<IFaq>
        data={faqs}
        columns={columns}
        isLoading={isFetching}
        scroll={false}
        pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        total={total}
      />

      <FaqSheet
        open={isSheetOpen}
        onClose={handleSheetClose}
        editRecord={editRecord}
        defaultRole={role}
      />

      <ConfirmModal<IFaq>
        open={isDeleteOpen}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteRecord(null);
        }}
        currentRecord={deleteRecord}
        onConfirm={handleDeleteConfirm}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        iconPreset="delete"
        variant="danger"
      />
    </div>
  );
};

export default FaqList;
