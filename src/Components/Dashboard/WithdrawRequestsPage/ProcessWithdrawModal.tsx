import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import { Button } from "@/Components/ui/button";
import { FormInput, FormTextarea } from "@/Components/ui/CustomUi/ReuseForm/Form";

type TProcessStatus = "PROCESSING" | "COMPLETED" | "FAILED";

// matches processWithdrawValidationSchema exactly
const processSchema = z
    .object({
        status: z.enum(["PROCESSING", "COMPLETED", "FAILED"], {
            message: "status is required",
        }),
        transactionId: z.string().trim().min(1).optional().or(z.literal("")),
        failureReason: z.string().trim().min(1).max(500).optional().or(z.literal("")),
    })
    .refine((data) => data.status !== "COMPLETED" || !!data.transactionId, {
        message: "Transaction ID is required when marking as Completed",
        path: ["transactionId"],
    })
    .refine((data) => data.status !== "FAILED" || !!data.failureReason, {
        message: "Failure reason is required when marking as Failed",
        path: ["failureReason"],
    });

export type ProcessFormValues = z.infer<typeof processSchema>;

const STATUS_LABELS: Record<TProcessStatus, string> = {
    PROCESSING: "Start Processing",
    COMPLETED: "Mark Completed",
    FAILED: "Mark Failed",
};

interface ProcessWithdrawModalProps {
    record: IWithdraw | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: ProcessFormValues) => void;
    isLoading: boolean;
}

const ProcessWithdrawModal = ({
    record,
    isOpen,
    onClose,
    onSubmit,
    isLoading,
}: ProcessWithdrawModalProps) => {
    const { control, handleSubmit, watch, reset, setValue } = useForm<ProcessFormValues>({
        resolver: zodResolver(processSchema),
        defaultValues: { status: "PROCESSING", transactionId: "", failureReason: "" },
    });

    const selectedStatus = watch("status");

    const handleClose = () => {
        reset();
        onClose();
    };

    const submit = (values: ProcessFormValues) => {
        onSubmit(values);
        reset();
    };

    if (!record) return null;

    return (
        <ReusableModal
            maxWidth="sm:max-w-lg"
            open={isOpen}
            onOpenChange={(v) => !v && handleClose()}
            title="Process Withdraw Request"
            footer={
                <div className="flex gap-3 w-full pb-2">
                    <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="process-withdraw-form"
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : STATUS_LABELS[selectedStatus]}
                    </Button>
                </div>
            }
        >
            <form id="process-withdraw-form" onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    Withdrawal <span className="font-semibold text-foreground">{record.withdrawNumber}</span> for{" "}
                    <span className="font-semibold text-foreground">{record.currency} {record.netAmount.toFixed(2)}</span>
                </p>

                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(STATUS_LABELS) as TProcessStatus[]).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                        field.onChange(s);
                                        setValue("transactionId", "");
                                        setValue("failureReason", "");
                                    }}
                                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${field.value === s
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-transparent text-foreground border-border hover:bg-muted"
                                        }`}
                                >
                                    {STATUS_LABELS[s]}
                                </button>
                            ))}
                        </div>
                    )}
                />

                {selectedStatus === "COMPLETED" && (
                    <FormInput
                        control={control}
                        name="transactionId"
                        label="Transaction ID"
                        placeholder="e.g. txn_1AbCdEf2345"
                    />
                )}

                {selectedStatus === "FAILED" && (
                    <FormTextarea
                        control={control}
                        name="failureReason"
                        label="Failure Reason"
                        placeholder="Why did this payout fail?"
                    />
                )}
            </form>
        </ReusableModal>
    );
};

export default ProcessWithdrawModal;
