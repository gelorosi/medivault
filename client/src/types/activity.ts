export interface Activity {
  id: number;
  action: "added" | "updated" | "deleted";
  entityType: "product" | "supplier";
  entityId: number;
  details: string;
  businessId: number;
  createdAt: string;
}
