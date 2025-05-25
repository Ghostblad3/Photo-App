import { http, HttpResponse } from 'msw';

type DeleteUserParams = {
  tableName: string;
  userId: string;
  userIdName: string;
};

type DeleteUserBody = undefined;
type DeleteUserResponseBody = {
  status: string;
  data: object;
  error: { message: string };
};

type TableNamesResponseBody = {
  status: 'success' | 'error';
  data: [
    {
      name: 'test_name';
    },
  ];
  error: { message: '' };
};

type RecordAddUserBody = {
  users: { [key: string]: string }[];
  tableName: string;
};

type RecordAddUserResponseBody = {
  status: 'success' | 'error';
  data: object;
  error: { message: '' };
};

type UpdateUserBody = {
  tableName: string;
  userId: string;
  user: { [key: string]: string };
};

type UpdateUserResponseBody = {
  status: 'success' | 'error';
  data: object;
  error: { message: string };
};

interface ScreenshotRequestParams {
  keyName: string;
  userId: string;
  tableName: string;
}

export interface ScreenshotResponse {
  status: 'success' | 'error';
  data: string; // base64 string
  error: {
    message: string;
  };
}

export const handlers = [
  http.get<
    never,
    undefined,
    TableNamesResponseBody,
    'http://localhost:3000/table/names'
  >('http://localhost:3000/table/names', async () => {
    return HttpResponse.json({
      status: 'success',
      data: [
        {
          name: 'test_name',
        },
      ],
      error: { message: '' },
    });
  }),
  http.post<
    never,
    RecordAddUserBody,
    RecordAddUserResponseBody,
    'http://localhost:3000/record/add-users'
  >('http://localhost:3000/record/add-users', async () => {
    return HttpResponse.json({
      status: 'success',
      data: {},
      error: { message: '' },
    });
  }),
  http.delete<
    DeleteUserParams,
    DeleteUserBody,
    DeleteUserResponseBody,
    'http://localhost:3000/record/remove-user/tableName/:tableName/userId/:userId/userIdName/:userIdName'
  >(
    'http://localhost:3000/record/remove-user/tableName/:tableName/userId/:userId/userIdName/:userIdName',
    async () => {
      return HttpResponse.json({
        status: 'success',
        data: {},
        error: { message: '' },
      });
    }
  ),
  http.patch<
    never,
    UpdateUserBody,
    UpdateUserResponseBody,
    'http://localhost:3000/record/update-user'
  >('http://localhost:3000/record/update-user', async ({ request }) => {
    const body = await request.json();

    // Simulate failure if name is "fail"
    if (body.user?.name === 'fail') {
      return HttpResponse.json(
        {
          status: 'error',
          data: {},
          error: { message: 'Update failed due to server error' },
        },
        { status: 400 } // or 500
      );
    }

    return HttpResponse.json({
      status: 'success',
      data: {}, // mock response data
      error: { message: '' },
    });
  }),
  http.get<
    ScreenshotRequestParams,
    never,
    ScreenshotResponse,
    'http://localhost:3000/screenshot/retrieve-user-screenshot/userIdName/:keyName/userId/:userId/tableName/:tableName'
  >(
    'http://localhost:3000/screenshot/retrieve-user-screenshot/userIdName/:keyName/userId/:userId/tableName/:tableName',
    ({ params }) => {
      const { keyName, userId, tableName } = params;

      console.log('params', params);

      if (!keyName || !userId || !tableName) {
        return HttpResponse.json(
          {
            status: 'error',
            data: '',
            error: { message: 'Missing required parameters' },
          },
          { status: 400 }
        );
      }

      const mockResponse: ScreenshotResponse = {
        status: 'success',
        data: 'mocked_base64_image_data==',
        error: { message: '' },
      };

      return HttpResponse.json(mockResponse, { status: 200 });
    }
  ),
];
