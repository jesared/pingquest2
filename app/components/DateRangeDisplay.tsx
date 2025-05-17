import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale"; // Importez la locale française

interface Props {
  startDate?: Date;
  endDate?: Date;
}

export default function DateRangeDisplay({ startDate, endDate }: Props) {
  if (!startDate && !endDate) {
    return null;
  }

  const formatDateWithDay = (date: Date) => {
    return format(date, "EEEE dd/MM/yyyy", { locale: fr });
  };

  if (startDate && endDate && isSameDay(startDate, endDate)) {
    return (
      <div className="flex justify-center items-center gap-2">
        {startDate && (
          <Badge variant={"outline"} className="text-md">
            {formatDateWithDay(startDate)}
          </Badge>
        )}
        <span className="text-md">(sur la journée)</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2">
      {startDate && (
        <Badge variant={"outline"} className="text-md">
          {formatDateWithDay(startDate)}
        </Badge>
      )}
      {startDate && endDate && <span> au </span>}
      {endDate && (
        <Badge variant={"outline"} className="text-md">
          {formatDateWithDay(endDate)}
        </Badge>
      )}
    </div>
  );
}
