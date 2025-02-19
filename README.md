# Crop Monitoring System

## API Overview
- This API is designed to be easy to integrate with front-end applications, mobile apps, or other third-party services to facilitate grocery store operations in a reliable and scalable manner. This project is a RESTful API for a Crop Monitor system. For detailed API usage, please refer to the API Documentation.

### Table of Contents

- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [API Documentation](#api-documentation)
- [Conclusion](#Conclusion)

---

### Key Features:
- **Crop Management**: Perform CRUD operations and filter for Crops.
- **Field Management**: Perform CRUD operations and filter for Fields.
- **Log Management**: Perform CRUD operations and filter for Logs.
- **Staff Member Management**: Perform CRUD operations and filter for Staff.
- **User Management**: Perform SignIn , SignUp and All operations allow for system.
- **Vehicle Management**: Perform CRUD operations and filter for vehicle.
- **Equipment Management**: Perform CRUD operations and filter for equipment.

### Technologies Used:
- **Security**: O Auth 2.0
- **Backend**: Type Script, Node.js, Express.js, Mongoose, JWT Authentication, bcrypt, multer
- **Database**: MongoDB for persistent data storage.
- **Versioning**: v1 (future updates may introduce new versions).
- **Containerization**: Node.js

---

## API Documentation

### Authorization
- This API uses Spring Security for authentication and authorization. Users must authenticate via the SignUp endpoint to obtain a JWT token. This token is required for accessing protected resources.only managers all endpoint access.

### Permissions and Access Limitations
- **MANAGER**: Full access to perform all CRUD operations.
- **ADMINISTRATIVE**: Cannot edit crop data, field data, or monitor logs related to crop details.
- **SCIENTIST:**: Cannot modify staff, vehicle, or equipment data.

### SignUp
- Create a new user account. Only authenticated Managers can add users with elevated roles.

**Endpoint**: `POST api/v1/auth/signUp`
- **Request Body** (JSON):
    ```json
    {
      "username": "ramesh",
      "email": "example.@gmail.com",
      "password": "password123"
    }

- Response(201 Created)
    ```json
    {
      "message": "User successfully registered."
    }

### SignIn
- Obtain a JWT token by providing valid credentials.
  **Endpoint**: `POST api/v1/auth/signIn`

- **Request Body** (JSON):
    ```json
    {
      "username": "example",
      "password": "password123"
    }

- Response(200 No Content)
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

### Using the JWT Token
- Authorization: Bearer <JWT_TOKEN>

### Forget Password
- This feature allows users to reset their password if they forget it. The process involves verifying the user's identity (via email) and enabling them to set a new password.

### Request Password Reset
- The user provides their email address. The system sends a password reset link or OTP to the registered email.

### Reset Password
- The user submits the new password using the token from the reset email or OTP.

**Endpoint**: `POST api/v1/auth/sendCode`
- **Request Body** (JSON):
    ```json
    {
      "email": "user@example.com"
    }

- Response(204 No Content)
    ```json
    {
      "message": "Password reset link has been sent to your email."
    }

- Error Response(204 No Content)
    ```json
    {
      "error": "Email not found."
    }

### Reset Password

**Endpoint**: `POST api/v1/auth/forgetPassword`
- **Request Body** (JSON):
    ```json
    {
      "token": "reset-token-from-email",
      "newPassword": "newSecurePassword123"
    }

- Response(200 No Content)
    ```json
    {
      "message": "Password has been reset successfully."
    }

- Error Response(204 No Content)
    ```json
    {
      "error": "Invalid or expired token."
    }

### 1. **Crops API**

### 1.1 Create a New Crop

**Endpoint**: `POST api/v1/crops`

- **Description**: Upload crop details and related information. This endpoint accepts a `multipart/form-data` request.
    - **Headers:**
    - `Content-Type`: `multipart/form-data`
      **Body (Multipart Form Data):**
      | Field            | Type     | Description                         | Example                            |
      |------------------|----------|-------------------------------------|------------------------------------|
      | `cropCode`       | `string` | Unique code for the crop            | `CROP-1`                           |
      | `cropName`       | `string` | Name of the crop                    | `Wheat`                            |
      | `scientificName` | `string` | Scientific name of the crop         | `Triticum aestivum`                |
      | `category`       | `string` | Crop category                       | `Cereal`                           |
      | `season`         | `string` | Season during which crop grows      | `Winter`                           |
      | `cropImage`      | `file`   | Image of the crop (binary file)     | `wheat.jpg`                        |
      | `logCodeList[]`  | `array`  | List of log codes                   | `["LOG-1", "LOG-2", "LOG-3"]`      |
      | `fieldCodeList[]`| `array`  | List of field codes                 | `["FIELD-1", "FIELD-2", "FIELD-3"]`|

### Response
- **200 OK**: Crop details uploaded successfully.
- **400 Bad Request**: Invalid or missing data.
- **401 Unauthorized**: Authorization required.

### 1.2 Update an Crop

**Endpoint**: `PUT api/v1/crops/{cropId}`

- **Description**: Updates the details of an existing crop.
    - **Headers:**
    - `Content-Type`: `multipart/form-data`
      **Body (Multipart Form Data):**
      | Field            | Type     | Description                         | Example                            |
      |------------------|----------|-------------------------------------|------------------------------------|
      | `cropName`       | `string` | Name of the crop                    | `Wheat`                            |
      | `scientificName` | `string` | Scientific name of the crop         | `Triticum aestivum`                |
      | `category`       | `string` | Crop category                       | `Cereal`                           |
      | `season`         | `string` | Season during which crop grows      | `Winter`                           |
      | `cropImage`      | `file`   | Image of the crop (binary file)     | `wheat.jpg`                        |
      | `logCodeList[]`  | `array`  | List of log codes                   | `["LOG-1", "LOG-2"`                |
      | `fieldCodeList[]`| `array`  | List of field codes                 | `["FIELD-1", "FIELD-2"`            |

- Response(200 No Content)
- **200 No Content**: Indicates that the crop was updated successfully. No content is returned in the response body.
- **400 Bad Request**: Invalid input or missing required fields.
- **404 Not Found**: The crop with the specified cropId does not exist.
- **401 Unauthorized**: Authorization required.

### 1.3 Delete an crop

**Endpoint**: `DELETE api/v1/crops/{cropId}`

- **Description**: Deletes a specific crop from the database.
- Response(200 No Content)
    ```json
    {
      "message": "crop deleted successfully"
    }

- **404 Not Found**: Crop with the specified cropId does not exist.
- **401 Unauthorized**: Authorization required.

### 1.4 Get a Specific Crop

**Endpoint**: `GET api/v1/crops/{cropId}`

- **Description**: Retrieves details of a specific crop by its cropId.
    - Response (200 OK):
  ```json
  {
    "cropName": "Wheat",
    "scientificName": "Triticum aestivum",
    "category": "Cereal",
    "season": "Winter",
    "cropImage": "wheat_updated.jpg",
    "logCodeList": ["LOG001", "LOG002", "LOG004"],
    "fieldCodeList": ["FLD001", "FLD003"]
  }

### 1.5 Get All Crops

**Endpoint**: `GET api/v1/crops`

- **Description**: Retrieves all available crops in the database.
- Response (200 OK):
    ```json
    [
      {
        "cropName": "Wheat",
        "scientificName": "Triticum aestivum",
        "category": "Cereal",
        "season": "Winter",
        "cropImage": "wheat_updated.jpg",
        "logCodeList": ["LOG-1", "LOG-2", "LOG-4"],
        "fieldCodeList": ["FIELD-1", "FIELD-3"]
      },
      {
        "cropName": "Corn",
        "scientificName": "Zea mays",
        "category": "Grain",
        "season": "Summer",
        "cropImage": "corn_updated.jpg",
        "logCodeList": ["LOG-5", "LOG-6", "LOG-7"],
        "fieldCodeList": ["FIELD-5", "FIELD-6", "FIELD-7"]
      }
    ]

## 2. **Field API**

### 2.1 Create a New Field

**Endpoint**: `POST api/v1/fields`

- **Description**: Upload field details and related information. This endpoint accepts a `multipart/form-data` request.
    - **Headers:**
    - `Content-Type`: `multipart/form-data`
      **Body (Multipart Form Data):**
      | Field              | Type     | Description                         | Example                            |
      |--------------------|----------|-------------------------------------|------------------------------------|
      | `fieldCode`        | `string` | Unique identifier for the field     | `FIELD-1`                          |
      | `name`             | `string` | Name of the crop                    | `Farm A`                           |
      | `location`         | `string` | Scientific name of the crop         | `152.3, 56.2`                      |
      | `extentSize`       | `string` | Crop category                       | `15.5`                             |
      | `fieldImage1`      | `file`   | Image of the crop (binary file)     | `field_image1.jpg`                 |
      | `fieldImage2`      | `file`   | Image of the crop (binary file)     | `field_image2.jpg`                 |
      | `equipmentsList[]` | `array`  | List of log codes                   | `["EQUIP001", "EQUIP002"]`         |
      | `memberCodeList[]` | `array`  | List of log codes                   | `["MEMBER-1", "MEMBER-2"]`             |
      | `logCodeList[]`    | `array`  | List of field codes                 | `["LOG-1", "LOG-2"]`             |
      | `cropCodeList[]`   | `array`  | List of field codes                 | `["CROP-1", "CROP-2"]`             |

### Response
- **200 OK**: field details uploaded successfully.
- **400 Bad Request**: Invalid or missing data.
- **401 Unauthorized**: Authorization required.

### 2.2 Update a Field

**Endpoint**: `PUT api/v1/fields/{fieldId}`

- **Description**: Update a Customer.
- **Headers:**
    - `Content-Type`: `multipart/form-data`
      **Body (Multipart Form Data):**
      | Field              | Type     | Description                         | Example                            |
      |--------------------|----------|-------------------------------------|------------------------------------|
      | `name`             | `string` | Name of the crop                    | `Farm B`                           |
      | `location`         | `string` | Scientific name of the crop         | `122.3, 106.2`                      |
      | `extentSize`       | `string` | Crop category                       | `10.5`                             |
      | `fieldImage1`      | `file`   | Image of the crop (binary file)     | `field_image1.jpg`                 |
      | `fieldImage2`      | `file`   | Image of the crop (binary file)     | `field_image2.jpg`                 |
      | `equipmentsList[]` | `array`  | List of log codes                   | `["EQUIP002", "EQUIP005"]`         |
      | `memberCodeList[]` | `array`  | List of log codes                   | `["MEMBER-2", "MEMBER-6"]`             |
      | `logCodeList[]`    | `array`  | List of field codes                 | `["LOG-1", "LOG-3"]`             |
      | `cropCodeList[]`   | `array`  | List of field codes                 | `["CROP-1", "CROP-3"]`             |

- **200 No Content**: Indicates that the field was updated successfully. No content is returned in the response body.
- **400 Bad Request**: Invalid input or missing required fields.
- **404 Not Found**: The field with the specified fieldId does not exist.
- **401 Unauthorized**: Authorization required.

### 2.3 Delete a Field

**Endpoint**: `DELETE api/v1/fields/{fieldId}`

- **Description**: Deletes a specific Field from the Fields.
- Response(200 No Content)
  ```json
  {
     "message": "Field deleted successfully"
  }

- **404 Not Found**: Crop with the specified cropId does not exist.
- **401 Unauthorized**: Authorization required.

### 2.4 Get a Specific Field

**Endpoint**: `GET api/v1/fields/{fieldId}`

- **Description**: Retrieves details of a specific Customer by it's customerId.
- Response (200 OK):
    ```json
    {
      "fieldCode": "FIELD-1",
      "name": "Farm A",
      "location": "Northwest Sector",
      "extentSize": 15.5,
      "fieldImage1": "field_image1.jpg",
      "fieldImage2": "field_image2.jpg",
      "equipmentsList": ["EQUIP001", "EQUIP002"],
      "memberCodeList": ["MEM001", "MEM002"],
      "logCodeList": ["LOG-1", "LOG-2"],
      "cropCodeList": ["CROP-1", "CROP-2"]
    }

### 2.5 Get All Field

**Endpoint**: `GET api/v1/fields`

- **Description**: Retrieves all available customers in the customerList.
- Response (200 OK):
    ```json
    [
      {
        "fieldCode": "FIELD-1",
        "name": "Farm A",
        "location": "Northwest Sector",
        "extentSize": 15.5,
        "fieldImage1": "field_image1.jpg",
        "fieldImage2": "field_image2.jpg",
        "equipmentsList": ["EQUIP001", "EQUIP002"],
        "memberCodeList": ["MEM001", "MEM002"],
        "logCodeList": ["LOG-1", "LOG-2"],
        "cropCodeList": ["CROP-1", "CROP-2"]
      },
      {
        "fieldCode": "FIELD-2",
        "name": "Farm B",
        "location": "Southeast Sector",
        "extentSize": 25.3,
        "fieldImage1": "farm_b_image1.jpg",
        "fieldImage2": "farm_b_image2.jpg",
        "equipmentsList": ["EQUIPMENT-3", "EQUIPMENT-4", "EQUIPMENT-5"],
        "memberCodeList": ["MEMBER-3", "MEMBER-4"],
        "logCodeList": ["LOG-3", "LOG-4"],
        "cropCodeList": ["CROP-3", "CROP-4"]
      }
    ]

## 3. **Logs API**

### 3.1 Create a New Logs

**Endpoint**: `POST api/v1/logs`

- **Description**: Upload field details and related information. This endpoint accepts a `multipart/form-data` request.
    - **Headers:**
    - `Content-Type`: `multipart/form-data`
      **Body (Multipart Form Data):**
      | Field              | Type     | Description                                     | Example                            |
      |--------------------|----------|-------------------------------------------------|------------------------------------|
      | `logCode`          | `string` | Unique identifier for the log                   | `LOG-1`                            |
      | `date`             | `string` | Date when the log was created                   | `2024-11-01`                       |
      | `logDetails`       | `string` | Detailed description of the log                 | `First planting of Wheat`          |
      | `observedImage`    | `file`   | Image related to the log (binary)               | `log_image.jpg`                    |
      | `staffList[]`      | `array`  | List of staff members associated with the log   | `["MEMBER-1", "MEMBER-2"]`         |
      | `cropList[]`       | `array`  | List of crop codes associated with the log      | `["CROP-1", "CROP-2"]`             |
      | `fieldList[]`      | `array`  | List of field codes associated with the log     | `["LOG-1", "LOG-2"]`               |

- **200 OK**: field details uploaded successfully.
- **400 Bad Request**: Invalid or missing data.

### 3.2 Update a Logs

**Endpoint**: `PUT api/v1/logs/{logId}`

- **Description**: Update a Logs.
- **Headers:**
    - `Content-Type`: `multipart/form-data`
      **Body (Multipart Form Data):**
      | Field              | Type     | Description                                     | Example                            |
      |--------------------|----------|-------------------------------------------------|------------------------------------|
      | `date`             | `string` | Date when the log was created                   | `2024-11-02`                       |
      | `logDetails`       | `string` | Detailed description of the log                 | `First planting of Wheat`          |
      | `observedImage`    | `file`   | Image related to the log (binary)               | `log_image.jpg`                    |
      | `staffList[]`      | `array`  | List of staff members associated with the log   | `["MEMBER-1"]`                     |
      | `cropList[]`       | `array`  | List of crop codes associated with the log      | `["CROP-1"]`                       |
      | `fieldList[]`      | `array`  | List of field codes associated with the log     | `["LOG-1"]`                        |

- **200 No Content**: Indicates that the logs was updated successfully. No content is returned in the response body.
- **400 Bad Request**: Invalid input or missing required logs.
- **404 Not Found**: The log with the specified logId does not exist.

### 3.3 Delete a Logs

**Endpoint**: `DELETE api/v1/logs/{logId}`

- **Description**: Deletes a specific Logs from the logsDetails.
    - Response(204 No Content)
        ```json
        {
          "message": "Log deleted successfully"
        }

- **401 Unauthorized**: Authorization is required to access this endpoint.
- **404 Not Found**: The specified staff member does not exist.

### 3.4 Get a Specific Logs

**Endpoint**: `GET api/v1/logs/{logId}`

- **Description**: Retrieves details of a specific log by it's logId.
- Response (200 OK):
    ```json
    {
      "logCode": "LOG-1",
      "date": "2024-11-01",
      "logDetails": "First planting of Wheat",
      "observedImage": "log_image.jpg", 
      "staffList": ["MEMBER-1", "MEMBER-2"],
      "cropList": ["CROP-1", "CROP-2"],
      "fieldList": ["FIELD-1", "FIELD-2"]
    }


### 3.5 Get All Logs

**Endpoint**: `GET api/v1/logs`

- **Description**: Retrieves all available logs in the logList.
- Response (200 OK):
    ```json
    [
      {
         "logCode": "LOG-1",
         "date": "2024-11-01",
         "logDetails": "First planting of Wheat",
         "observedImage": "log_image.jpg", 
         "staffList": ["MEMBER-1", "MEMBER-2"],
         "cropList": ["CROP-1", "CROP-2"],
         "fieldList": ["FIELD-1", "FIELD-2"]
      },
      {
         "logCode": "LOG-2",
         "date": "2024-11-02",
         "logDetails": "log details for wheat planting",
         "observedImage": "log_image.jpg", 
         "staffList": ["MEMBER-3"],
         "cropList": ["CROP-3"],
         "fieldList": ["FIELD-3"]
      }
    ]

## 4. **Staff API**

### 4.1 Create a New Staff

**Endpoint**: `POST api/v1/staff`

- **Description**: Creates a new member.
- **Request Body** (JSON):
    ```json
    {
      "memberCode": "MEMBER-1",
      "firstName": "John",
      "lastName": "Doe",
      "joinedDate": "2024-01-15",
      "dateOfBirth": "1990-05-20",
      "gender": "MALE",
      "designation": "Field Manager",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "addressLine3": "Springfield",
      "addressLine4": "IL",
      "addressLine5": "USA",
      "contactNo": "1234567890",
      "email": "john.doe@example.com",
      "role": "ADMIN",
      "equipmentList": ["EQUIPMENT-1", "EQUIPMENT-2"],
      "vehicleList": ["VEHICLE-1", "VEHICLE-2"],
      "fieldCodeList": ["FIELD-1", "FIELD-2"],
      "logList": ["LOG-1", "LOG-2"]
    }

- **201 Created**: Staff member added successfully.
- **400 Bad Request**: Invalid input or missing required fields.
- **401 Unauthorized**: Authorization is required to access this endpoint.

### 4.2 Update a Staff

**Endpoint**: `PUT api/v1/staff/{staffId}`

- **Description**: Update a staff member.
- **Request Body** (JSON):
    ```json
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "joinedDate": "2023-12-01",
      "dateOfBirth": "1985-03-10",
      "gender": "FEMALE",
      "designation": "Logistics Manager",
      "addressLine1": "456 Oak Street",
      "addressLine2": "Suite 12",
      "addressLine3": "Metropolis",
      "addressLine4": "NY",
      "addressLine5": "USA",
      "contactNo": "0987654321",
      "email": "jane.smith@example.com",
      "role": "STAFF",
      "equipmentList": ["EQUIPMENT-3"],
      "vehicleList": ["VEHICLE-3"],
      "fieldCodeList": ["FIELD-3", "FIELD-4"],
      "logList": ["LOG-3"]
}

- **200 No Content**: Staff member updated successfully.
- **400 Bad Request**: Invalid input or missing required fields.
- **401 Unauthorized**: Authorization is required to access this endpoint.
- **404 Not Found**: The specified staff member does not exist.

### 4.3 Delete a Staff

**Endpoint**: `DELETE api/v1/staff/{staffId}`

- **Description**: Deletes a specific Staff member from the all members.
- Response(204 No Content)
    ```json
    {
      "message": "Staff Member deleted successfully"
    }

- **401 Unauthorized**: Authorization is required to access this endpoint.
- **404 Not Found**: The specified staff member does not exist.

### 4.4 Get a Specific Staff

**Endpoint**: `GET api/v1/staff/{staffId}`

- **Description**: Retrieves details of a specific Staff by it's staffId.
- Response (200 OK):
    ```json
    {
      "memberCode": "MEMBER-1",
      "firstName": "John",
      "lastName": "Doe",
      "joinedDate": "2024-01-15",
      "dateOfBirth": "1990-05-20",
      "gender": "MALE",
      "designation": "Field Manager",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "addressLine3": "Springfield",
      "addressLine4": "IL",
      "addressLine5": "USA",
      "contactNo": "1234567890",
      "email": "john.doe@example.com",
      "role": "ADMIN",
      "equipmentList": ["EQUIPMENT-1", "EQUIPMENT-2"],
      "vehicleList": ["VEHICLE-1", "VEHICLE-2"],
      "fieldCodeList": ["FIELD-1", "FIELD-2"],
      "logList": ["LOG-1", "LOG-2"]
    }

### 4.5 Get All Staff

**Endpoint**: `GET api/v1/staff`

- **Description**: Retrieves all available members in the staff member list.
- Response (200 OK):
    ```json
    [
      {
        "memberCode": "MEMBER-1",
        "firstName": "John",
        "lastName": "Doe",
        "joinedDate": "2024-01-15",
        "dateOfBirth": "1990-05-20",
        "gender": "MALE",
        "designation": "Field Manager",
        "addressLine1": "123 Main Street",
        "addressLine2": "Apartment 4B",
        "addressLine3": "Springfield",
        "addressLine4": "IL",
        "addressLine5": "USA",
        "contactNo": "1234567890",
        "email": "john.doe@example.com",
        "role": "ADMIN",
        "equipmentList": ["EQUIPMENT-1", "EQUIPMENT-2"],
        "vehicleList": ["VEHICLE-1", "VEHICLE-2"],
        "fieldCodeList": ["FIELD-1", "FIELD-2"],
        "logList": ["LOG-1", "LOG-2"]
      },
      {
        "memberCode": "STF002",
        "firstName": "Alice",
        "lastName": "Johnson",
        "joinedDate": "2023-11-10",
        "dateOfBirth": "1992-07-15",
        "gender": "FEMALE",
        "designation": "Agronomist",
        "addressLine1": "789 Elm Avenue",
        "addressLine2": "Building 5",
        "addressLine3": "Greenfield",
        "addressLine4": "CA",
        "addressLine5": "USA",
        "contactNo": "9876543210",
        "email": "alice.johnson@example.com",
        "role": "MANAGER",
        "equipmentList": ["EQUIPMENT-5", "EQUIPMENT-6", "EQUIPMENT-7"],
        "vehicleList": ["VEHICLE-4", "VEHICLE-5"],
        "fieldCodeList": ["FIELD-5", "FIELD-6"],
        "logList": ["LOG-4", "LOG-5", "LOG-6"]
      }
    ]

## 5. **Vehicle API**

### 5.1 Create a New Vehicle

**Endpoint**: `POST api/v1/vehicles`

- **Description**: Assign a new vehicle.
- **Request Body** (JSON):
    ```json
    {
      "vehicleCode": "VEHICLE-1",
      "licensePlateNumber": "ABC-1234",
      "name": "Ford Ranger",
      "category": "Pickup Truck",
      "fuelType": "Diesel",
      "status": "Active",
      "remark": "Assigned to Field Operations",
      "memberCode": "MEMBER-1"
    }

- **201 Created**: Vehicle successfully added.
- **400 Bad Request**: Missing or invalid fields.
- **401 Unauthorized**: Authorization required.

### 5.2 Update a Vehicle

**Endpoint**: `PUT api/v1/vehicles/{vehicleId}`

- **Description**: Update a vehicle.
- **Request Body** (JSON):
    ```json
    {
      "licensePlateNumber": "JKL-7890",
      "name": "Nissan Navara",
      "category": "Utility",
      "fuelType": "Diesel",
      "status": "Available",
      "remark": "Ready for operations",
      "memberCode": "MEMBER-4"
    }

- **200 No Content**: Vehicle updated successfully.
- **400 Bad Request**: Invalid input or missing required fields.
- **404 Not Found**: Vehicle with the specified vehicleCode does not exist.
- **401 Unauthorized**: Authorization required.

### 5.3 Delete a Vehicle

**Endpoint**: `DELETE api/v1/vehicles/{vehicleId}`

- **Description**: Deletes a specific vehicle from the vehicles.
- Response(204 No Content)
    ```json
    {
      "message": "Vehicle deleted successfully"
    }

- **404 Not Found**: Vehicle with the specified vehicleCode does not exist.
- **401 Unauthorized**: Authorization required.

### 5.4 Get a Specific Vehicle

**Endpoint**: `GET api/v1/vehicles/{vehicleId}`

- **Description**: Retrieves details of a specific vehicle by it's vehicleId.
- Response (200 OK):
    ```json
    {
      "vehicleCode": "VEHICLE-1",
      "licensePlateNumber": "ABC-1234",
      "name": "Ford Ranger",
      "category": "Pickup Truck",
      "fuelType": "Diesel",
      "status": "Active",
      "remark": "Assigned to Field Operations",
      "memberCode": "MEMBER-1"
    }

### 5.5 Get All Vehicle

**Endpoint**: `GET api/v1/vehicles`

- **Description**: Retrieves all available vehicles in the vehicleList.
- Response (200 OK):
    ```json
    [
      {
        "vehicleCode": "VEHICLE-1",
        "licensePlateNumber": "ABC-1234",
        "name": "Ford Ranger",
        "category": "Pickup Truck",
        "fuelType": "Diesel",
        "status": "Active",
        "remark": "Assigned to Field Operations",
        "memberCode": "MEMER-1"
      },
      {
        "vehicleCode": "VEHICLE-2",
        "licensePlateNumber": "JKL-7890",
        "name": "Nissan Navara",
        "category": "Utility",
        "fuelType": "Diesel",
        "status": "Available",
        "remark": "Ready for operations",
        "memberCode": "MEMBER-4"
      }
    ]

## 6. **Equipment API**

### 6.1 Create a New Equipment

**Endpoint**: `POST api/v1/equipments`

- **Description**: Creates a new Equipment.
- **Request Body** (JSON):
    ```json
    {
      "equipmentCode": "EQ001",
      "name": "Tractor",
      "type": "Machinery",
      "status": "Active",
      "availableCount": 5,
      "staffCodeList": ["MEMBER-1", "MEMBER-2"],
      "fieldList": ["FIELD-1", "FIELD-2"]
    }

- **201 Created**: Equipment successfully added.
- **400 Bad Request**: Missing or invalid fields.
- **401 Unauthorized**: Authorization required.

### 6.2 Update a Equipment

**Endpoint**: `PUT api/v1/equipemnts/{equipmentId}`

- **Description**: Update a equipment.
- **Request Body** (JSON):
    ```json
    {
      "name": "Harvester",
      "type": "Machinery",
      "status": "In Maintenance",
      "availableCount": 3,
      "staffCodeList": ["MEMBER-3", "MEMBER-4"],
      "fieldList": ["FIELD-3", "FIELD-4"]
    }

- **200 No Content**: Equipment updated successfully.
- **400 Bad Request**: Invalid input or missing required fields.
- **404 Not Found**: Equipment with the specified equipmentCode does not exist.
- **401 Unauthorized**: Authorization required.

### 6.3 Delete a Equipment

**Endpoint**: `DELETE api/v1/equipemnts/{equipemntId}`

- **Description**: Deletes a specific equipment from the all equipment.
- Response(204 No Content)
    ```json
    {
      "message": "Equipment deleted successfully"
    }

- **404 Not Found**: Equipment with the specified equipmentCode does not exist.
- **401 Unauthorized**: Authorization required.

### 6.4 Get a Specific Equipment

**Endpoint**: `GET api/v1/equipemnts/{equipemntId}`

- **Description**: Retrieves details of a specific equipment by it's equipmentId.
- Response (200 OK):
    ```json
    {
      "equipmentCode": "EQ001",
      "name": "Tractor",
      "type": "Machinery",
      "status": "Active",
      "availableCount": 5,
      "staffCodeList": ["MEMBER-1", "MEMBER-2"],
      "fieldList": ["FIELD-1", "FIELD-2"]
    }

### 6.5 Get All Equipment

**Endpoint**: `GET api/v1/equipemnts`

- **Description**: Retrieves all available equipment in the equipmentList.
- Response (200 OK):
    ```json
    [
      {
        "equipmentCode": "EQUIPMENT-1",
        "name": "Tractor",
        "type": "Machinery",
        "status": "Active",
        "availableCount": 5,
        "staffCodeList": ["MEMBER-1", "MEMBER-2"],
        "fieldList": ["FIELD-1", "FIELD-2"]
      },
      {
        "equipmentCode": "EQUIPMENT-2",
        "name": "Irrigation Pump",
        "type": "Machinery",
        "status": "Decommissioned",
        "availableCount": 0,
        "staffCodeList": ["MEMBER-7", "MEMBER-8"],
        "fieldList": ["FIELD-7", "FIELD-8"]
      }
    ]

---

## Conclusion

- This API provides a comprehensive solution for Monitoring Crops. With features such as crop management, field management, logs management, staff member management, vehicle management, equipment management, and users manage, it is designed to be easily integrated into front-end applications, mobile apps, or other services. For further inquiries or assistance, please refer to the GitHub Repository or contact the development team.
