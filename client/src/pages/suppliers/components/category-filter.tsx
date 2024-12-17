import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Categories</SelectItem>
        <SelectItem value="OTC">OTC Only</SelectItem>
        <SelectItem value="PRESCRIPTION">Prescription Only</SelectItem>
      </SelectContent>
    </Select>
  );
}
