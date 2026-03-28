import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  available: "bg-success/10 text-success border-success/20",
  sold: "bg-muted text-muted-foreground border-muted",
  rented: "bg-primary/10 text-primary border-primary/20",
  active: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  scheduled: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const classes = statusColors[status] || "bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={`capitalize ${classes}`}>
      {status}
    </Badge>
  );
}
