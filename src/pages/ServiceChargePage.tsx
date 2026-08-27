import { useState } from "react";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { Button } from "@/Components/ui/button";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import ReusablePagination from "@/Components/ui/CustomUi/ReusablePagination";
import {
  useDeleteServiceChargeMutation,
  useGetServiceChargesQuery,
  useUpdateServiceChargeMutation,
} from "@/redux/features/serviceCharge/serviceChargeApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import SpinLoader from "@/Components/ui/CustomUi/SpinLoader";
import { IServiceCharge } from "@/types/serviceCharge.type";
import ServiceChargeCard from "@/Components/Cards/ServiceChargeCard";
import ServiceChargeSheet from "@/Components/Dashboard/ServiceChargePage/ServiceChargeSheet";

const ServiceChargePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IServiceCharge | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<IServiceCharge | null>(null);

  const { data, isFetching } = useGetServiceChargesQuery(
    { page: currentPage, limit },
    { refetchOnMountOrArgChange: true }
  );
  const [updateServiceCharge] = useUpdateServiceChargeMutation();
  const [deleteServiceCharge] = useDeleteServiceChargeMutation();

  const charges: IServiceCharge[] = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleAddNew = () => {
    setEditRecord(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (charge: IServiceCharge) => {
    setEditRecord(charge);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditRecord(null);
  };

  const handleDeleteClick = (charge: IServiceCharge) => {
    setDeleteRecord(charge);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async (charge: IServiceCharge) => {
    await tryCatchWrapper(
      deleteServiceCharge,
      { params: { id: charge._id } },
      "Deleting service charge..."
    );
    setIsDeleteOpen(false);
    setDeleteRecord(null);
  };

  const handleToggleStatus = async (charge: IServiceCharge) => {
    await tryCatchWrapper(
      updateServiceCharge,
      { params: { id: charge._id }, body: { isActive: !charge.isActive } },
      "Updating status..."
    );
  };

  return (
    <PageWraper title="Service Charge">
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddNew}>+ Add New Service Charge</Button>
      </div>

      {isFetching ? (
        <div className="text-center py-20 text-muted-foreground">
          <SpinLoader />
        </div>
      ) : charges.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No service charges found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {charges.map((charge) => (
            <ServiceChargeCard
              key={charge._id}
              charge={charge}
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

      <ServiceChargeSheet open={isSheetOpen} onClose={handleSheetClose} editRecord={editRecord} />

      <ConfirmModal<IServiceCharge>
        open={isDeleteOpen}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteRecord(null);
        }}
        currentRecord={deleteRecord}
        onConfirm={handleDeleteConfirm}
        title="Delete Service Charge"
        description="Are you sure you want to delete this service charge? This action cannot be undone."
        confirmText="Delete"
        iconPreset="delete"
        variant="danger"
      />
    </PageWraper>
  );
};

export default ServiceChargePage;