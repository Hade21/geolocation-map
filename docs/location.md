# Location API Spec

## Add Location

Endpoints: POST /api/units/:unitId/location

Params: - unitId

Request Body :

```json
{
  "long": "132435467763212",
  "lat": "543314474345232",
  "alt": "976576341443445",
  "location": "example location",
  "dateTime": "132435534242"
}
```

Response Body (Success):

Status Code : 201

```json
{
  "data": {
    "id": 1,
    "long": "132435467763212",
    "lat": "543314474345232",
    "alt": "976576341443445",
    "location": "example location",
    "dateTime": "132435534242"
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

## Get Location

Endpoints: GET /api/units/:unitId/location

Params: - unitId

Response Body (Success):

Status Code : 200

```json
{
  "data": [
    {
      "id": 1,
      "long": "132435467763212",
      "lat": "543314474345232",
      "alt": "976576341443445",
      "location": "example location",
      "dateTime": "132435534242"
    },
    {
      "id": 2,
      "long": "132435467763212",
      "lat": "543314474345232",
      "alt": "976576341443445",
      "location": "example location",
      "dateTime": "132435534242"
    },
    {
      "id": 3,
      "long": "132435467763212",
      "lat": "543314474345232",
      "alt": "976576341443445",
      "location": "example location",
      "dateTime": "132435534242"
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
    "message": "No location recorded"
  }
}
```
