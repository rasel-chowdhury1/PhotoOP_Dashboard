import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import { Button } from "@/Components/ui/button";
import {
  useGetFaresQuery,
  useCreateFareMutation,
  useUpdateFareMutation,
  useDeleteFareMutation,
} from "@/redux/features/fare/fareApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import { fareSchema, fareDefaultValues, type FareFormValues } from "@/schemas/fareSchema";
import CountrySelectModal from "@/Components/Dashboard/FareManagement/CountrySelectModal";
import ViewFareModal from "@/Components/Dashboard/FareManagement/ViewFareModal";
import FareCreatePage from "@/Components/Dashboard/FareManagement/FareCreatePage";

export default function FareManagement() {
  const [view, setView] = useState<"list" | "create">("list");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countryInput, setCountryInput] = useState("");
  const [viewRecord, setViewRecord] = useState<IFare | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<IFare | null>(null);

  const { data, isFetching } = useGetFaresQuery(
    {
      page: currentPage,
      limit,
      searchTerm: search || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [createFare, { isLoading: isCreating }] = useCreateFareMutation();
  const [updateFare, { isLoading: isUpdating }] = useUpdateFareMutation();
  const [deleteFare, { isLoading: isDeleting }] = useDeleteFareMutation();

  const fares: IFare[] = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const form = useForm<FareFormValues>({
    resolver: zodResolver(fareSchema) as Resolver<FareFormValues>,
    defaultValues: fareDefaultValues,
  });

  // ── Create ─────────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setCountryInput("");
    setIsCountryModalOpen(true);
  };

  const handleContinueCountry = () => {
    if (!countryInput) return;
    form.reset({ ...fareDefaultValues, country: countryInput });
    setIsEditMode(false);
    setEditId(null);
    setIsCountryModalOpen(false);
    setView("create");
  };

  // ── Edit ───────────────────────────────────────────────────────────────────

  const handleOpenEdit = (record: IFare) => {
    form.reset({
      country: record.country,

      minoGoRatePerKm: record.minoGoRatePerKm,
      minoGoBookingFee: record.minoGoBookingFee,
      minoGoBaseFee: record.minoGoBaseFee,
      minoGoMinimumFare: record.minoGoMinimumFare,

      minoXLRatePerKm: record.minoXLRatePerKm,
      minoXLBookingFee: record.minoXLBookingFee,
      minoXLBaseFee: record.minoXLBaseFee,
      minoXLMinimumFare: record.minoXLMinimumFare,

      minoMotoRatePerKm: record.minoMotoRatePerKm,
      minoMotoBookingFee: record.minoMotoBookingFee,
      minoMotoBaseFee: record.minoMotoBaseFee,
      minoMotoMinimumFare: record.minoMotoMinimumFare,

      waitingChargeEnabled: record.waitingChargeEnabled,
      waitingChargeGracePeriod: record.waitingChargeGracePeriod,
      waitingChargeRate: record.waitingChargeRate,

      surchargeEnabled: record.surchargeEnabled,
      surchargeValue: record.surchargeValue,

      platformCommissionPercentage: record.platformCommissionPercentage,
    });
    setIsEditMode(true);
    setEditId(record.id);
    setView("create");
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (values: FareFormValues) => {
    const body = { ...values, isActive: true, isDeleted: false };
    if (isEditMode && editId) {
      await tryCatchWrapper(updateFare, { params: { id: editId }, body }, "Updating fare...");
    } else {
      await tryCatchWrapper(createFare, { body }, "Creating fare...");
    }
    setView("list");
    setIsEditMode(false);
    setEditId(null);
    form.reset(fareDefaultValues);
  };

  const handleCancel = () => {
    setView("list");
    setIsEditMode(false);
    setEditId(null);
    form.reset(fareDefaultValues);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (record: IFare) => {
    await tryCatchWrapper(deleteFare, { params: { id: record.id } }, "Deleting fare...");
    setDeleteRecord(null);
  };

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns: Column<IFare>[] = [
    {
      header: "ID",
      accessorKey: "id",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (
        <span className="font-medium text-gray-700">
          {(currentPage - 1) * limit + index + 1}
        </span>
      ),
    },
    {
      header: "Country",
      accessorKey: "country",
      render: (value: string) => <span className="font-medium capitalize">{value}</span>,
    },
    {
      header: "Mino Go",
      accessorKey: "minoGoRatePerKm",
      render: (value: number) => `$${value ?? 0}/km`,
    },
    {
      header: "Mino XL",
      accessorKey: "minoXLRatePerKm",
      render: (value: number) => `$${value ?? 0}/km`,
    },
    {
      header: "Mino Moto",
      accessorKey: "minoMotoRatePerKm",
      render: (value: number) => `$${value ?? 0}/km`,
    },
    {
      header: "Waiting Charge",
      accessorKey: "waitingChargeRate",
      render: (_: unknown, record: IFare) =>
        record.waitingChargeEnabled ? `$${record.waitingChargeRate}/min` : "—",
    },
    {
      header: "Surcharge",
      accessorKey: "surchargeValue",
      render: (_: unknown, record: IFare) =>
        record.surchargeEnabled ? `${record.surchargeValue}%` : "—",
    },
    {
      header: "Commission",
      accessorKey: "platformCommissionPercentage",
      render: (value: number) => `${value}%`,
    },
    {
      header: "Actions",
      accessorKey: "id",
      render: (_: unknown, record: IFare) => (
        <div className="flex items-center gap-3">
          <ReusableTooltip content="View Details">
            <Eye
              onClick={() => setViewRecord(record)}
              className="size-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            />
          </ReusableTooltip>
          <ReusableTooltip content="Edit">
            <Pencil
              onClick={() => handleOpenEdit(record)}
              className="size-4 cursor-pointer text-amber-500 hover:text-amber-600 transition-colors"
            />
          </ReusableTooltip>
          <ReusableTooltip content="Delete">
            <Trash2
              onClick={() => setDeleteRecord(record)}
              className="size-4 cursor-pointer text-red-500 hover:text-red-600 transition-colors"
            />
          </ReusableTooltip>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  if (view === "create") {
    return (
      <FareCreatePage
        form={form}
        isLoading={isEditMode ? isUpdating : isCreating}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <PageWraper title="Fare Management">
      <div className="flex gap-3 flex-wrap mb-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <ReuseSearchInput
            className="min-w-60"
            placeholder="Search..."
            setSearch={setSearch}
            setPage={setCurrentPage}
          />

        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="size-4" />
          Add New Pricing
        </Button>
      </div>

      <ReusableTable<IFare>
        data={fares}
        columns={columns}
        pagination={true}
        scroll={false}
        isLoading={isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        total={total}
      />

      <CountrySelectModal
        isOpen={isCountryModalOpen}
        onOpenChange={setIsCountryModalOpen}
        value={countryInput}
        onChange={setCountryInput}
        onContinue={handleContinueCountry}
      />

      <ViewFareModal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        fare={viewRecord}
      />

      <ConfirmModal<IFare>
        open={!!deleteRecord}
        onCancel={() => setDeleteRecord(null)}
        currentRecord={deleteRecord}
        onConfirm={handleDelete}
        variant="danger"
        title="Delete Fare?"
        description={`Are you sure you want to delete the fare for ${deleteRecord?.country}? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
      />
    </PageWraper>
  );
}
