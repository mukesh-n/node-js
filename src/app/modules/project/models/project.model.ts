import { Base } from "./base.model";

export class userneed extends Base {
  id: number = 0;
  product_id: number | null = null;
  userneed_id: number = 0;
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date | null = null;
  modified_on: Date | null = null;
  version: number = 0;
  is_active: boolean = false;
  lang_code: string | null = null;
  parent_id: number = 0;
  notes: string | null = null;
}

