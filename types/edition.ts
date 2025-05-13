export interface Edition {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  is_open: boolean;
  title?: string;
  created_at: Date;
  updated_at: Date;
}