import { FrappeApp } from '../frappe_app';
import { handleError } from '../utils/error';
import type { Filter, FrappeDoc, GetDocListArgs, GetLastDocArgs } from './types';

export class FrappeDB extends FrappeApp {
  /**
   * Get a document from the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @returns Promise which resolves to the document object
   */
  async getDoc<T = any>(doctype: string, docname: string = ''): Promise<FrappeDoc<T>> {
    try {
      const { data } = await this.axios.get(`/api/resource/${doctype}/${encodeURIComponent(docname)}`);
      return data.data;
    } catch (error: any) {
      handleError(error, 'There was an error while fetching the document.');
    }
  }

  /**
   * Gets a list of documents from the database for a particular doctype. Add filters, sorting order and pagination to get a filtered and sorted list of documents.
   * @param {string} doctype Name of the doctype
   * @param {@type GetDocListArgs} [args] Arguments for the query
   * @returns Promise which resolves to an array of documents
   */
  async getDocList<T = any, K = FrappeDoc<T>>(doctype: string, args?: GetDocListArgs<K>) {
    let params = {};

    if (args) {
      const { fields, filters, orFilters, orderBy, limit, limit_start, groupBy, asDict = true } = args;
      const orderByString = orderBy ? `${String(orderBy?.field)} ${orderBy?.order ?? 'asc'}` : '';
      params = {
        fields: fields ? JSON.stringify(fields) : undefined,
        filters: filters ? JSON.stringify(filters) : undefined,
        or_filters: orFilters ? JSON.stringify(orFilters) : undefined,
        order_by: orderByString,
        group_by: groupBy,
        limit,
        limit_start,
        as_dict: asDict,
      };
    }

    try {
      const { data } = await this.axios.get<{ data: T[] }>(`/api/resource/${doctype}`, { params });
      return data.data;
    } catch (error: any) {
      handleError(error, 'There was an error while fetching the documents.');
    }
  }

  /** Creates a new document in the database
   * @param {string} doctype Name of the doctype
   * @param {Object} value Contents of the document
   * @returns Promise which resolves with the complete document object
   */
  async createDoc<T = any>(doctype: string, value: T): Promise<FrappeDoc<T>> {
    try {
      const { data } = await this.axios.post(`/api/resource/${doctype}`, { ...value });
      return data.data;
    } catch (error: any) {
      handleError(error, 'There was an error while creating the document.');
    }
  }

  /** Updates a document in the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @param {Object} value Contents of the document to update (only the fields that are to be updated)
   * @returns Promise which resolves with the complete document object
   */
  async updateDoc<T = any>(doctype: string, docname: string | null, value: Partial<T>): Promise<FrappeDoc<T>> {
    const name = docname ? encodeURIComponent(docname) : docname;

    try {
      const { data } = await this.axios.put(`/api/resource/${doctype}/${name}`, { ...value });
      return data.data;
    } catch (error: any) {
      handleError(error, 'There was an error while updating the document.');
    }
  }

  /**
   * Deletes a document in the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @returns Promise which resolves an object with a message "ok"
   */
  async deleteDoc(doctype: string, docname?: string | null): Promise<{ message: string }> {
    const name = docname ? encodeURIComponent(docname) : docname;

    try {
      const { data } = await this.axios.delete(`/api/resource/${doctype}/${name}`);
      return data;
    } catch (error: any) {
      handleError(error, 'There was an error while deleting the document.');
    }
  }

  /**
   * Gets count of documents from the database for a particular doctype with the given filters
   * @param {string} doctype Name of the doctype
   * @param {@type Filter[]} [filters] Filters to be applied in the count query
   * @param {boolean} [cache] Whether to cache the result or not
   * @param {boolean} [debug] Whether to print debug messages or not
   * @returns Promise which resolves a number
   */
  async getCount<T = any>(
    doctype: string,
    filters?: Filter<T>[],
    cache: boolean = false,
    debug: boolean = false,
  ): Promise<number> {
    const params: any = {
      doctype,
      filters: [],
    };

    if (filters) params.filters = filters ? JSON.stringify(filters) : undefined;
    if (cache) params.cache = cache;
    if (debug) params.debug = debug;

    try {
      const { data } = await this.axios.get('/api/method/frappe.client.get_count', { params });
      return data.message;
    } catch (error: any) {
      handleError(error, 'There was an error while getting the document count.');
    }
  }
  /**
   * Get a document from the database
   * @param {string} doctype Name of the doctype
   * @param {@type GetLastDocArgs} [args] Arguments for the query
   * @returns Promise which resolves to the document object
   */
  async getLastDoc<T = any>(doctype: string, args?: GetLastDocArgs<FrappeDoc<T>>): Promise<FrappeDoc<T>> {
    let queryArgs: GetLastDocArgs<FrappeDoc<T>> = {
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    };

    if (args) {
      queryArgs = {
        ...queryArgs,
        ...args,
      };
    }

    const getDocLists = await this.getDocList<{ name: string }, FrappeDoc<T>>(doctype, {
      ...queryArgs,
      limit: 1,
      fields: ['name'],
    });

    if (getDocLists.length > 0) {
      return this.getDoc<T>(doctype, getDocLists[0].name);
    }

    return {} as FrappeDoc<T>;
  }
}
