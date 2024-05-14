export type TransactionType = {
  id: string;
  value: number;
  status: TransferStatus;
};

export type TransactionPublishType = {
  id: string;
  status: TransferStatus;
};

export enum TransferStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}
