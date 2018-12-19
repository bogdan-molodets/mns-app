export const activeSession = {
    "status": "Ok",
    "sessions": [
        {
            "session_id": "123",
            "description": "string",
            "lat": 0,
            "lon": 0,
            "hgt": 0,
            "timestamp": "string",
            "state": "active",
            "tolerance": 4
        },
        {
            "session_id": "456",
            "description": "string",
            "lat": 0,
            "lon": 0,
            "hgt": 0,
            "timestamp": "string",
            "state": "stopped",
            "tolerance": 4
        }
    ]
}
export const emptySession = {
    "status": "Ok",
    "sessions": [

    ]
}

export const archiveSessions = {
    "status": "Ok",
    "sessions": [
        {
            "session_id": "13",
            "description": "string",
            "lat": 0,
            "lon": 0,
            "hgt": 0,
            "timestamp": "12-12-12",
            "state": "stopped",
            "tolerance": 4
        },
        {
            "session_id": "416",
            "description": "string",
            "lat": 0,
            "lon": 0,
            "hgt": 0,
            "timestamp": "12-12-12",
            "state": "stopped",
            "tolerance": 4
        }
    ]
}

export const config = {
    "status": "Ok",
    "config": {
        "language": "string",
        "email": "string"
    }
}

export const createRes = {
    "status": "Ok"
}

export const createResError = {
    "status": "Error",
    "message": "string"
}

export const targets = {
    "status": "Ok",
    "target": [
        {
            "target_id": "88",
            "X0": 0,
            "Y0": 0,
            "H0": 0,
            "HA": "string",
            "VA": "string",
            "dX": 0,
            "dY": 0,
            "dH": 0,
            "last_upd": "12-12-12"
        },
        {
            "target_id": "99",
            "X0": 0,
            "Y0": 0,
            "H0": 0,
            "HA": "string",
            "VA": "string",
            "dX": 0,
            "dY": 0,
            "dH": 0,
            "last_upd": "12-12-13"
        }
    ]
}
export const target={
    "status": "Ok",
    "target": {
      "target_id": "2323",
      "X0": 0,
      "Y0": 0,
      "H0": 0,
      "HA": "string",
      "VA": "string",
      "dX": 0,
      "dY": 0,
      "dH": 0,
      "last_upd": "string"
    }
  }
export const targetsEmpty = {
    "status": "Ok",
    "target": [

    ]
}
export const monitoringActive = {
    "status": "Ok",
    "state": "alarm",
    "timestamp": "string"
}
