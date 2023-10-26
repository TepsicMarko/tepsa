import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

export interface UsePaginatedQueryProps<T>
  extends Omit<UseQueryOptions<T>, "queryFn" | "queryKey"> {
  queryKey: string;
  queryFn: (pagination: PaginationOptions) => Promise<T>;
  initialPaginationConfig?: Partial<PaginationOptions>;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface Pagination extends PaginationOptions {
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
}

const usePaginatedQuery = <T>(props: UsePaginatedQueryProps<T>) => {
  const { queryKey, queryFn, initialPaginationConfig, ...queryOptions } = props;
  const [page, setPage] = useState(initialPaginationConfig?.page || 1);
  const [pageSize, setPageSize] = useState(
    initialPaginationConfig?.pageSize || 10
  );

  const query = useQuery({
    queryKey: [queryKey, page, pageSize],
    queryFn: () => queryFn({ page, pageSize }),
    ...queryOptions,
  });

  return { query, pagination: { page, pageSize, setPage, setPageSize } };
};

export default usePaginatedQuery;
