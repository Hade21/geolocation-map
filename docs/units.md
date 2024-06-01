# Units API Spec

## Add Units

Endpoints: POST /api/units

Request Body:

```json
{
  "name": "Example Name",
  "type": "Mobile Crane",
  "egi": "Tadano"
}
```

Response Body (Success):

Status Code: 201

```json
{
  "data": {
    "id": "qwertyuiop",
    "name": "Example Name",
    "type": "Mobile Crane",
    "egi": "Tadano"
  }
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

Response Body (Failed):

Status Code: 409

```json
{
  "error": {
    "status": 409,
    "message": "Units already exist"
  }
}
```

## Update Units

Endpoints: PUT /api/units/:id

Params : id

Request Body:

```json
{
  "name": "Example Name",
  "type": "Mobile Crane",
  "egi": "Tadano"
}
```

Response Body (Success):

Status Code: 200

```json
{
  "data": {
    "id": "qwertyuiop",
    "name": "Example Name",
    "type": "Mobile Crane",
    "egi": "Tadano"
  }
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

Response Body (Failed):

Status Code: 404

```json
{
  "error": {
    "status": 404,
    "message": "Units not found"
  }
}
```

## Remove Units

Endpoints: DELETE /api/units/:id

Params : id

Response Body (Success):

Status Code: 200

```json
{
  "data": {
    "message": "Unit deleted succesfuly"
  }
}
```

Response Body (Failed):

Status Code: 404

```json
{
  "error": {
    "status": 404,
    "message": "Units not found"
  }
}
```

## Get All Units

Endponts: GET /api/units

Response Body (Success):

Status Code: 200

```json
{
  "data": [
    {
      "id": "qwertyuiop",
      "name": "Example Name",
      "type": "Mobile Crane",
      "egi": "Tadano"
    },
    {
      "id": "qwertyuiop",
      "name": "Example Name",
      "type": "Mobile Crane",
      "egi": "Tadano"
    },
    {
      "id": "qwertyuiop",
      "name": "Example Name",
      "type": "Mobile Crane",
      "egi": "Tadano"
    }
  ]
}
```

Response Body (Failed):

Status Code: 404

```json
{
  "error": {
    "status": 404,
    "message": "Units not found"
  }
}
```
