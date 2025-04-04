import { http, HttpResponse } from 'msw';

export const handlers = [
  // Existing handler
  http.get('http://localhost:3000/api/get', () => {
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),

  // Add a handler for the missing endpoint
  http.get('http://localhost:3000/table/names', () => {
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
];
