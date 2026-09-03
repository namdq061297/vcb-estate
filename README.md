# My App

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.11.

## Development server

To start a local development server, run:

```bash
ng serve
```

## Mock API

This workspace uses the root `api-docs.json` file as the source of truth for fallback DEV API mocking, while custom responses live under `apps/my-app/src/app/mock-response`.

### Khi mở app

1. Chạy mock server:

```bash
npm run mock:api
```

2. Chạy Angular app:

```bash
npm start
```

3. Mở trình duyệt tại `http://localhost:4200`.

### Khi API thay đổi

Nếu Swagger/OpenAPI thay đổi, làm theo checklist này:

1. Cập nhật `api-docs.json` trước để đồng bộ contract mới.
2. Nếu có API mới, thêm file response tương ứng trong `apps/my-app/src/app/mock-response`.
3. Nếu request thay đổi query/body/path/header, cập nhật file response mock và phần gọi API trong app nếu cần.
4. Nếu response đổi field hoặc structure, cập nhật type/interface trong `apps/my-app/src/app/core/models` hoặc `apps/my-app/src/app/mock-response/mock-response.interfaces.ts`.
5. Nếu cần đổi endpoint đang dùng, cập nhật `apps/my-app/src/app/core/config/api-endpoints.ts`.
6. Chạy lại:

```bash
npm run mock:api
npm start
```

### Quy ước đặt file mock

- Mỗi file response nên khớp route và method, ví dụ `api/v1/reg/updateDocument.post.response.json`.
- Nếu route có path param, dùng thư mục đặt tên theo route, ví dụ `api/v1/auth/inquiryCustomerProfile.post.response.json`.
- File response có thể chứa `statusCode`, `delayMs`, `headers`, và `body` để mô phỏng dữ liệu thật sát hơn.
- Nếu muốn giả lập lỗi, tạo file `*.error.response.json` cho cùng route, hoặc thêm `statusCode` >= 400 vào response.
- Khi gọi API, có thể ép mock trả lỗi bằng query `?mockScenario=error` hoặc header `x-mock-scenario: error`.

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# angular-theme
