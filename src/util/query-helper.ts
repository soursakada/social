type LogicalOperators<T> = {
    $and?: Array<QueryCondition<T>>;
    $or?: Array<QueryCondition<T>>;
    $nor?: Array<QueryCondition<T>>;
    $not?: QueryCondition<T>;
};

type QueryCondition<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
    ? QueryCondition<U> | { [operator: string]: any } | NestedFilter<U>
    : T[P] | { [operator: string]: any } | NestedFilter<T[P]>;
} & LogicalOperators<T>;

// Define a nested filter type to support 'filters' in nested objects
type NestedFilter<T> = {
    filters?: QueryCondition<T>;
    where?: QueryCondition<T>;
};

// type PopulateFields<T> = {
//     [P in keyof T]?: T[P] extends Array<infer U>
//     ?
//     | true
//     | {
//         where?: QueryCondition<U>;
//         filters?: QueryCondition<U>;
//         populate?: PopulateFields<U>;
//         fields?: Array<keyof U>;
//         select?: Array<keyof U>;
//     }
//     :
//     | true
//     | {
//         where?: QueryCondition<T[P]>;
//         filters?: QueryCondition<T[P]>;
//         populate?: PopulateFields<T[P]>;
//         fields?: (keyof T[P])[];
//         select?: (keyof T[P])[];
//     };
// };

export interface PaginateResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface PaginationMeta {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export type PopulateFields<T = any> = {
    [key: string]: true | { fields?: string[]; populate?: PopulateFields } | PopulateFields;
};

export interface QueryParams<T> {
    sort?: Partial<Record<keyof T, 'asc' | 'desc'>>;
    filters?: QueryCondition<T>;
    where?: QueryCondition<T>;
    populate?: PopulateFields<T>;
    fields?: [string];
    pagination?: {
        page?: number;
        pageSize?: number;
    };
    start?: number;
    limit?: number;
    status?: 'draft' | 'published';
    locale?: string;
}
