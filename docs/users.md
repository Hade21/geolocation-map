# User API Spec

## Add User

Endpoints: POST /api/v1/users

Request Body:

```json
{
  "username": "Hade21",
  "firstName": "Muhammad",
  "lastName": "Abdurrohman",
  "password": "fakePassword",
  "role": "admin"
}
```

Response Body (Success):

Status Code: 201

```json
{
  "id": "uincibdnx",
  "username": "Hade21",
  "firstName": "Muhammad",
  "lastName": "Abdurrohman",
  "role": "admin"
}
```

Response Body (Failed):

Status Code: 400

```json
{
  "error": {
    "status": 400,
    "message": "Missing input fields"
  }
}
```

## Update User

Endpoints: PUT /api/v1/users/:id

Params: - Id

Request Body:

```json
{
  "username": "Hade21",
  "firstName": "Muhammad",
  "lastName": "Abdurrohman",
  "password": "fakePassword123",
  "role": "admin"
}
```

Response Body (Success):

Status Code: 200

```json
{
  "id": "uincibdnx",
  "username": "Hade21",
  "firstName": "Muhammad",
  "lastName": "Abdurrohman",
  "role": "admin"
}
```

Response Body (Failed):

Status Code: 401

```json
{
  "error": {
    "status": 401,
    "message": "Unauthorized"
  }
}
```

Response Body (Failed):

Status Code: 404

```json
{
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

## Remove User

Endpoints: DELETE /api/v1/users/:id

Params: - Id

Response Body (Success):

Status Code: 200

```json
{
  "error": {
    "status": 200,
    "message": "User deleted successfully"
  }
}
```

Response Body (Failed):

Status Code: 404

```json
{
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

Response Body (Failed):

Status Code: 401

```json
{
  "error": {
    "status": 401,
    "message": "Unauthorized"
  }
}
```

## Change Role

Endpoints: PATCH /api/v1/users/:id

Params: - Id

Authorization: - Bearer token

Request Body:

```json
{
    "role": "users" || "guests"
}
```

Response Body (Success):

Status Code: 200

```json
{
  "username": "Hade21",
  "firstName": "Muhammad",
  "lastName": "Abdurrohman",
  "role": "users"
}
```

Response Body (Failed):

Status Code: 401

```json
{
  "error": {
    "status": 401,
    "message": "Unauthorized"
  }
}
```

Response Body (Failed):

Status Code: 404

```json
{
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```
