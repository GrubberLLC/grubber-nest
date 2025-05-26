import { jest } from '@jest/globals'; // Or your specific Jest import if different

export const setupSupabaseMocks = () => {
  /**
   * This is the core "thenable" mock object.
   * It's returned by query type methods (select, insert, etc.) and by all filter methods.
   * You can await this object directly. Its resolution is controlled by
   * mockResolvedValue() and mockRejectedValue().
   */
  const filterBuilderMock: any = {
    // Using 'any' for simplicity here, can be typed more strictly
    // Query Modifiers & Filters: all return `this` for chaining
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    rangeGt: jest.fn().mockReturnThis(),
    rangeGte: jest.fn().mockReturnThis(),
    rangeLt: jest.fn().mockReturnThis(),
    rangeLte: jest.fn().mockReturnThis(),
    rangeAdjacent: jest.fn().mockReturnThis(),
    overlaps: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),

    // Query Executors: these also return `this` because the `filterBuilderMock` itself is thenable.
    single: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    csv: jest.fn().mockReturnThis(),
    explain: jest.fn().mockReturnThis(),

    // Promise-like behavior for `await`
    then: jest.fn(),
    catch: jest.fn(),
    finally: jest.fn(),

    mockResolvedValue: jest.fn(function (this: any, value: any) {
      const response =
        value !== undefined &&
        value !== null &&
        typeof value.data !== 'undefined' &&
        typeof value.error !== 'undefined'
          ? value
          : { data: value, error: null };

      this.then = jest.fn((onfulfilled: any) =>
        Promise.resolve(response).then(onfulfilled),
      );
      this.catch = jest.fn((onrejected: any) =>
        Promise.resolve(response).catch(onrejected),
      ); // Should not reject on resolve
      this.finally = jest.fn((onfinally: any) =>
        Promise.resolve(response).finally(onfinally),
      );
      return this;
    }),

    mockRejectedValue: jest.fn(function (this: any, err: any) {
      const errorResponse =
        err &&
        typeof err.message === 'string' &&
        (typeof err.code === 'string' || typeof err.code === 'undefined') // Supabase errors might not always have a code
          ? err
          : {
              message: String(err),
              code: 'MOCK_ERROR_CODE',
              details: '',
              hint: '',
            };

      const rejection = { data: null, error: errorResponse };

      this.then = jest.fn((_: any, onrejected: any) =>
        Promise.reject(rejection).then(_, onrejected),
      ); // Correctly pass fulfilled as undefined
      this.catch = jest.fn((onrejected: any) =>
        Promise.reject(rejection).catch(onrejected),
      );
      this.finally = jest.fn((onfinally: any) =>
        Promise.reject(rejection).finally(onfinally),
      );
      return this;
    }),
  };

  filterBuilderMock.mockResolvedValue({ data: [], error: null }); // Default resolution

  const queryBuilderMock = {
    select: jest.fn(() => filterBuilderMock),
    insert: jest.fn(() => filterBuilderMock),
    update: jest.fn(() => filterBuilderMock),
    upsert: jest.fn(() => filterBuilderMock),
    delete: jest.fn(() => filterBuilderMock),
    rpc: jest.fn(() => filterBuilderMock),
  };

  const supabaseMock = {
    from: jest.fn(() => queryBuilderMock),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn((callback?: (status: string, err?: any) => void) => {
        if (callback) {
          Promise.resolve().then(() => callback('SUBSCRIBED'));
        }
        return {
          unsubscribe: jest.fn(),
        };
      }),
    })),
    auth: {
      // signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      // getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      // signOut: jest.fn().mockResolvedValue({ error: null }),
      // ... other auth methods you might use
    },
    storage: {
      from: jest.fn(() => ({
        // upload: jest.fn().mockResolvedValue({ data: { path: 'mock/path.png' }, error: null }),
        // download: jest.fn().mockResolvedValue({ data: new Blob(), error: null }),
        // ... other storage bucket methods
      })),
    },
    // Add other top-level Supabase client properties/methods if needed
  };

  return { supabaseMock, queryBuilderMock, filterBuilderMock };
};
