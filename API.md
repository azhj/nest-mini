# API Documentation

**Base URL**: `http://localhost:3008`

**Framework**: NestJS 11 + Prisma 6 + MySQL

**Authentication**: None (no auth guards applied)

**Global Middleware**: `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform` enabled.

**CORS**: Enabled for all origins.

---

## Table of Contents

- [Overview](#overview)
- [Modules](#modules)
- [Root](#root-controller)
- [Cats Module](#cats-module)
- [Students Module](#students-module)
- [Database Schema](#database-schema)

---

## Overview

| Item | Value |
|------|-------|
| Port | `3008` (default, configurable via `PORT` env var) |
| ORM | Prisma (`@praque/client`) |
| Database | MySQL |
| API Docs | No Swagger decorators |
| Auth | None |

---

## Modules

```
AppModule
├── PrismaModule       (global) → PrismaService
├── CatsModule         → CatsController + CatsService
└── StudentsModule     → StudentsController + StudentsService
```

---

## Root Controller

### `GET /`

Health check endpoint.

**Response**

| Status | Body |
|--------|------|
| 200 OK | `"Hello World!"` (string) |

---

## Cats Module

### `GET /cats`

List all cats.

**Response**

| Status | Body |
|--------|------|
| 200 OK | `Cat[]` — array of all cat objects |

**`Cat` object shape**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Auto-generated unique ID (cuid) |
| `name` | `string` | Cat's name |
| `age` | `number` | Age in years |
| `breed` | `string` | Breed identifier |
| `createdAt` | `string` (ISO 8601) | Creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Last update timestamp |

---

### `GET /cats/:id`

Get a single cat by ID.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Cat unique ID (cuid) |

**Response**

| Status | Body |
|--------|------|
| 200 OK | `Cat` object |
| 404 Not Found | `NotFoundException` if cat does not exist |

---

### `POST /cats`

Create a new cat.

**Request Body** (`CreateCatDto`)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | `string` | Yes | minLength: 1 | Cat's name |
| `age` | `number` | Yes | integer, 1–30 | Age in years |
| `breed` | `string` | Yes | one of the allowed values below | Breed |

**Allowed `breed` values**

```
orange | black | white | brown | gray | tabby | siamese
```

**Example**

```json
{
  "name": "Mimi",
  "age": 3,
  "breed": "orange"
}
```

**Response**

| Status | Body |
|--------|------|
| 201 Created | Newly created `Cat` object |
| 400 Bad Request | Validation errors |

---

### `PUT /cats/:id`

Update an existing cat.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Cat unique ID (cuid) |

**Request Body** (`UpdateCatDto`) — all fields optional

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | `string` | minLength: 1 | Cat's name |
| `age` | `number` | integer, 1–30 | Age in years |
| `breed` | `string` | one of allowed values | Breed |

**Example**

```json
{
  "age": 4
}
```

**Response**

| Status | Body |
|--------|------|
| 200 OK | Updated `Cat` object |
| 400 Bad Request | Validation errors |
| 404 Not Found | `NotFoundException` if cat does not exist |

---

### `DELETE /cats/:id`

Delete a cat.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Cat unique ID (cuid) |

**Response**

| Status | Body |
|--------|------|
| 204 No Content | Empty body on success |
| 404 Not Found | `NotFoundException` if cat does not exist |

---

## Students Module

### `POST /students/list`

Query students with pagination and optional filters. Returns a paginated list.

**Request Body** (`QueryStudentDto`)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | `number` | No | `1` | Page number (min: 1) |
| `pageSize` | `number` | No | `10` | Items per page (min: 1, max: 100) |
| `name` | `string` | No | — | Filter by student name (partial match) |
| `grade` | `string` | No | — | Filter by grade |
| `className` | `string` | No | — | Filter by class name |

**Example**

```json
{
  "page": 1,
  "pageSize": 10,
  "grade": "高一",
  "className": "1班"
}
```

**Response**

| Status | Body |
|--------|------|
| 200 OK | `PaginatedResult<Student>` |
| 400 Bad Request | Validation errors |

**`PaginatedResult<T>` shape**

| Field | Type | Description |
|-------|------|-------------|
| `list` | `T[]` | Array of items for the current page |
| `total` | `number` | Total number of matching records |
| `page` | `number` | Current page number |
| `pageSize` | `number` | Items per page |
| `totalPages` | `number` | Total number of pages |

---

### `GET /students/:id`

Get a single student by ID.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Student unique ID (cuid) |

**Response**

| Status | Body |
|--------|------|
| 200 OK | `Student` object |
| 404 Not Found | `NotFoundException` if student does not exist |

---

### `POST /students`

Create a new student.

**Request Body** (`CreateStudentDto`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Student name |
| `age` | `number` | Yes | Age (integer) |
| `gender` | `string` | Yes | Gender |
| `grade` | `string` | Yes | Grade, e.g. "高一" |
| `className` | `string` | Yes | Class name, e.g. "1班" |
| `phone` | `string` | Yes | Contact phone number |
| `address` | `string` | Yes | Home address |

**Example**

```json
{
  "name": "张三",
  "age": 16,
  "gender": "男",
  "grade": "高一",
  "className": "1班",
  "phone": "13800138000",
  "address": "北京市朝阳区xxx路xx号"
}
```

**Response**

| Status | Body |
|--------|------|
| 201 Created | Newly created `Student` object |
| 400 Bad Request | Validation errors |

---

### `PUT /students/:id`

Update an existing student.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Student unique ID (cuid) |

**Request Body** (`UpdateStudentDto`) — all fields optional

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Student name |
| `age` | `number` | Age (integer) |
| `gender` | `string` | Gender |
| `grade` | `string` | Grade |
| `className` | `string` | Class name |
| `phone` | `string` | Contact phone number |
| `address` | `string` | Home address |

**Example**

```json
{
  "phone": "13900139000",
  "address": "上海市浦东新区xxx路xx号"
}
```

**Response**

| Status | Body |
|--------|------|
| 200 OK | Updated `Student` object |
| 400 Bad Request | Validation errors |
| 404 Not Found | `NotFoundException` if student does not exist |

---

### `DELETE /students/:id`

Delete a student.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Student unique ID (cuid) |

**Response**

| Status | Body |
|--------|------|
| 204 No Content | Empty body on success |
| 404 Not Found | `NotFoundException` if student does not exist |

---

## Database Schema

**ORM**: Prisma with MySQL

### `Cat` Model

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `String` | `@id`, `@default(cuid())` |
| `name` | `String` | — |
| `age` | `Int` | — |
| `breed` | `String` | — |
| `createdAt` | `DateTime` | `@default(now())` |
| `updatedAt` | `DateTime` | `@updatedAt` |

### `Student` Model

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `String` | `@id`, `@default(cuid())` |
| `name` | `String` | — |
| `age` | `Int` | — |
| `gender` | `String` | — |
| `grade` | `String` | — |
| `className` | `String` | — |
| `phone` | `String` | — |
| `address` | `String` | — |
| `createdAt` | `DateTime` | `@default(now())` |
| `updatedAt` | `DateTime` | `@updatedAt` |

---

## Endpoint Summary

| # | Method | Route | Path Params | Body | Response |
|---|--------|-------|-------------|------|----------|
| 1 | GET | `/` | — | — | `string` |
| 2 | GET | `/cats` | — | — | `Cat[]` |
| 3 | GET | `/cats/:id` | `id` | — | `Cat` |
| 4 | POST | `/cats` | — | `CreateCatDto` | `Cat` (201) |
| 5 | PUT | `/cats/:id` | `id` | `UpdateCatDto` | `Cat` |
| 6 | DELETE | `/cats/:id` | `id` | — | `void` (204) |
| 7 | POST | `/students/list` | — | `QueryStudentDto` | `PaginatedResult<Student>` |
| 8 | GET | `/students/:id` | `id` | — | `Student` |
| 9 | POST | `/students` | — | `CreateStudentDto` | `Student` (201) |
| 10 | PUT | `/students/:id` | `id` | `UpdateStudentDto` | `Student` |
| 11 | DELETE | `/students/:id` | `id` | — | `void` (204) |
