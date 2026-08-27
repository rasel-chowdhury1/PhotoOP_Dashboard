import { useState } from "react";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { Button } from "@/Components/ui/button";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import ReusablePagination from "@/Components/ui/CustomUi/ReusablePagination";
import PromoSheet from "@/Components/Dashboard/PromoPage/PromoSheet";
import {
  useDeletePromoMutation,
  useGetPromosQuery,
  useUpdatePromoMutation,
} from "@/redux/features/promo/promoApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import PromoCard from "@/Components/Cards/PromoCard";
import SpinLoader from "@/Components/ui/CustomUi/SpinLoader";

const PromoPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IPromo | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<IPromo | null>(null);

  const { data, isFetching } = useGetPromosQuery({ page: currentPage, limit }, { refetchOnMountOrArgChange: true });
  const [updatePromo] = useUpdatePromoMutation();
  const [deletePromo] = useDeletePromoMutation();

  const promos: IPromo[] = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleAddNew = () => {
    setEditRecord(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (promo: IPromo) => {
    setEditRecord(promo);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditRecord(null);
  };

  const handleDeleteClick = (promo: IPromo) => {
    setDeleteRecord(promo);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async (promo: IPromo) => {
    await tryCatchWrapper(
      deletePromo,
      { params: { id: promo.id } },
      "Deleting Promo..."
    );
    setIsDeleteOpen(false);
    setDeleteRecord(null);
  };

  const handleToggleStatus = async (promo: IPromo) => {
    const newStatus = promo.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await tryCatchWrapper(
      updatePromo,
      { params: { id: promo.id }, body: { status: newStatus } },
      "Updating status..."
    );
  };

  return (
    <PageWraper title="Promo">
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddNew}>+ Add New Promo</Button>
      </div>

      {isFetching ? (
        <div className="text-center py-20 text-muted-foreground">
          <SpinLoader />
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No promos found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggle={handleToggleStatus}
            />
          ))}
        </div>
      )}

      <div className="mt-10">
        <ReusablePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          limit={limit}
          total={total}
        />
      </div>

      <PromoSheet open={isSheetOpen} onClose={handleSheetClose} editRecord={editRecord} />

      <ConfirmModal<IPromo>
        open={isDeleteOpen}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteRecord(null);
        }}
        currentRecord={deleteRecord}
        onConfirm={handleDeleteConfirm}
        title="Delete Promo"
        description="Are you sure you want to delete this promo? This action cannot be undone."
        confirmText="Delete"
        iconPreset="delete"
        variant="danger"
      />
    </PageWraper>
  );
};

export default PromoPage;
