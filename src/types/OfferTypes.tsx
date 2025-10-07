export type TOffer = {
  id?: string;
  offerName: string;
  courseDays: number;
  amount?: number;
  discount?: number;
  additionalInfo?: string;
  featured?: boolean;
};

export type TOfferList = TOffer & { id: string };
