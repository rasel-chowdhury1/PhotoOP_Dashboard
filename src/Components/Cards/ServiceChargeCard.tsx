// Components/Cards/ServiceChargeCard.tsx
import { formatDate } from "@/utils/dateFormet";
import { Trash2, Pencil } from "lucide-react";
import { Switch } from "@/Components/ui/switch";
import Tag from "../ui/CustomUi/ReuseTag";
import { IServiceCharge } from "@/types/serviceCharge.type";

interface ServiceChargeCardProps {
    charge: IServiceCharge;
    onEdit: (charge: IServiceCharge) => void;
    onDelete: (charge: IServiceCharge) => void;
    onToggle: (charge: IServiceCharge) => void;
}

const ServiceChargeCard = ({ charge, onEdit, onDelete, onToggle }: ServiceChargeCardProps) => {
    return (
        <div className="rounded-xl border border-[#E5E5E5] bg-primary-color p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">

                <h1 className="flex-1 font-bold text-base sm:text-lg lg:text-xl truncate">{charge.name}</h1>
                <Switch
                    checked={charge.isActive}
                    onCheckedChange={() => onToggle(charge)}
                />
                <button
                    onClick={() => onDelete(charge)}
                    className="text-destructive hover:opacity-70 transition-opacity"
                >
                    <Trash2 className="size-5 cursor-pointer" />
                </button>
                <button
                    onClick={() => onEdit(charge)}
                    className="text-amber-500 hover:opacity-70 transition-opacity"
                >
                    <Pencil className="size-5 cursor-pointer" />
                </button>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm sm:text-base border-t border-border pt-3">
                <div className="flex justify-between">
                    <span className="font-bold ">Type:</span>
                    <span className="font-medium">
                        {charge.type === "PERCENTAGE" ? "Percentage" : "Flat amount"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold ">Value:</span>
                    <span className="font-medium">
                        {charge.type === "PERCENTAGE" ? `${charge.value}%` : `$${charge.value.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold ">Last updated:</span>
                    <span className="font-medium">
                        {formatDate(charge.updatedAt)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold ">Status:</span>
                    <Tag theme={charge.isActive ? "success" : "error"}>
                        {charge.isActive ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                </div>
            </div>
        </div>
    );
};

export default ServiceChargeCard;