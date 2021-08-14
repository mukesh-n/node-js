import _, { cond } from "lodash";
import { Pool, PoolClient } from "pg";
import { using } from "../global/utils";
import { userneed } from "../models/project.model";
import { BaseService } from "./base.service";

export class userneedService extends BaseService {
  sql_insert: string = `
    INSERT INTO tbluserneeds(
    code, name, product_id, created_by, modified_by, created_on, modified_on, version, lang_code, notes)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *;  
  `;
  sql_select: string = `
    SELECT tdi.id, tdi.code, tdi.name, tdi.product_id, tdi.created_by, tdi.modified_by, tdi.created_on, tdi.modified_on, tdi.version, tdi.lang_code, tdi.notes,
    tp.name product_name,
    version.ref_value_display_text version_name,
    criticality.ref_value_display_text criticality_name,
    phase.ref_value_display_text phase_name
    FROM tbluserneeds tdi
    LEFT JOIN tblproduct tp on tdi.product_id = tp.id
    @condition;
  `;
  sql_update: string = `
    UPDATE public.tbluserneeds
    SET code=$2, name=$3, product_id=$4, modified_by=$5, modified_on=$6, version= $7, lang_code=$8, notes=$9
    WHERE id = $1
    RETURNING *;
  `;
  public async select(
    _userneed: userneed
  ): Promise<Array<userneed>> {
    var result: Array<userneed> = [];
    try {
      await using(this.db.getDisposablePool(), async (pool) => {
        var client = await pool.connect();
        if (client != null) {
          result = await this.selectTransaction(client, _userneed);
        }
      });
    } catch (error) {
      throw error;
    }
    return result;
  }
  public async selectTransaction(
    _client: PoolClient,
    _userneed: userneed
  ): Promise<Array<userneed>> {
    var result: Array<userneed> = [];
    try {
      var query: string = this.sql_select;
      var condition_list: Array<string> = [];
      if (_userneed.id > 0) {
        condition_list.push(`tdi.id = ${_userneed.id}`);
      }
      if (_userneed.product_id && _userneed.product_id > 0) {
        condition_list.push(`tdi.product_id = ${_userneed.product_id}`);
      }
      if (condition_list.length > 0) {
        query = query.replace(
          /@condition/g,
          `WHERE ${condition_list.join(" and ")}`
        );
      } else {
        query = query.replace(/@condition/g, "");
      }
      var { rows } = await _client.query(query);
      if (rows.length > 0) {
        _.forEach(rows, (v) => {
          var temp: userneed = new userneed();
          temp.id = v.id != null ? parseInt(v.id) : 0;
          temp.product_id =
            v.product_id != null ? parseInt(v.product_id) : null;
          temp.created_by = v.created_by != null ? parseInt(v.created_by) : 0;
          temp.modified_by =
            v.modified_by != null ? parseInt(v.modified_by) : 0;
          temp.created_on = v.created_on;
          temp.modified_on = v.modified_on;
          temp.version = v.version != null ? parseInt(v.version) : 0;
          temp.is_active = v.is_active;
          temp.lang_code = v.lang_code;
          temp.notes = v.notes;
          result.push(temp);
        });
      }
    } catch (error) {
      throw error;
    }
    return result;
  }
  public async insert(_userneed: userneed): Promise<userneed> {
    try {
      await using(this.db.getDisposablePool(), async (pool) => {
        var client = await pool.connect();
        if (client != null) {
          await this.insertTransaction(client, _userneed);
        }
      });
    } catch (error) {
      throw error;
    }
    return _userneed;
  }
  public async insertTransaction(
    _client: PoolClient,
    _userneed: userneed
  ): Promise<void> {
    try {
      _userneed.created_on = new Date();
      _userneed.is_active = true;
      _userneed.version = 1;

      var { rows } = await _client.query(this.sql_insert, [
        _userneed.product_id,
        _userneed.created_by,
        _userneed.modified_by,
        _userneed.created_on,
        _userneed.modified_on,
        _userneed.version,
        _userneed.is_active,
        _userneed.lang_code,
        _userneed.notes,
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _userneed.id = row.id != null ? parseInt(row.id) : 0;
      }
    } catch (error) {
      throw error;
    }
  }

  public async update(_userneed: userneed): Promise<userneed> {
    try {
      await using(this.db.getDisposablePool(), async (pool) => {
        var client = await pool.connect();
        if (client != null) {
          await this.updateTransaction(client, _userneed);
        }
      });
    } catch (error) {
      throw error;
    }
    return _userneed;
  }
  public async updateTransaction(
    _client: PoolClient,
    _userneed: userneed
  ): Promise<void> {
    try {
      _userneed.modified_on = new Date();

      var { rows } = await _client.query(this.sql_update, [
        _userneed.id,
        _userneed.product_id,
        _userneed.modified_by,
        _userneed.modified_on,
        _userneed.version,
        _userneed.is_active,
        _userneed.lang_code,
        _userneed.notes,
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _userneed.id = row.id != null ? parseInt(row.id) : 0;
        _userneed.version = row.version != null ? parseInt(row.version) : 0;
      }
    } catch (error) {
      throw error;
    }
  }
}
