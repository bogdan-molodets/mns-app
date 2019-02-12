
export const sessions = [
    {
        "session_id": "13",
        "description": "string",
        "lat": 0,
        "lon": 0,
        "hgt": 0,
        "timestamp": "12-12-12",
        "state": "opened",
        "tolerance": 4
    },
    {
        "session_id": "416",
        "description": "string",
        "lat": 0,
        "lon": 0,
        "hgt": 0,
        "timestamp": "12-12-12",
        "state": "string",
        "tolerance": 4
    }
]


export const config = {

    language: "ukr",
    email: "volnov@maiol.com",
    bt_name: "hello",
    bt_addr: "kalinovaya 46",

    MAIL_SERVER: "domain",
    MAIL_PORT: 333,
    MAIL_USERNAME: "vasya",
    MAIL_PASSWORD: "1234567889",
    MAIL_USE_TLS: false,
    MAIL_USE_SSL: false

}


export const targets =
    [
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
        },
        {
            "target_id": "100",
            "X0": 0.3455,
            "Y0": 0.3455,
            "H0": 0.3485,
            "HA": "string",
            "VA": "string",
            "dX": 0,
            "dY": 0,
            "dH": 0,
            "last_upd": "12-12-13"
        },
        {
            "target_id": "105",
            "X0": 5.3455,
            "Y0": 2.4566,
            "H0": 3.1233,
            "HA": "string",
            "VA": "string",
            "dX": 0,
            "dY": 0,
            "dH": 0,
            "last_upd": "12-12-13"
        }
    ]


export const ips = {
    "status": "Ok",
    "if_list": [
        // {
        //     interface: "wlan0",
        //     itype: "wwerwvfew",
        //     mtu: "dnu",
        //     // ip: "",
        //     bcast: "varus",
        //     mask: "binary",
        //     hwaddr: "pushkina",
        //     UP: "true",
        //     RUNNING: "tru"
        // },
        {
            interface: "ethernet",
            itype: "wwerwvfew",
            mtu: "dnu",
            ip: "127.84.63.00",
            bcast: "varus",
            mask: "binary",
            hwaddr: "pushkina",
            UP: "true",
            RUNNING: "tru"
        }
    ]
}

export const wifi = {
    "status": "Ok",
    "wifi_list": [
        {
            "ssid": "guest",
            "bitrates": "efrff",
            "address": "rvvrrvv",
            "channel": "433434f",
            "encrypted": "wpa2",
            "encryption_type": "efff",
            "frequency": "34",
            "mode": "gta",
            "quality": "san andreas",
            "signal": "good",
            "noice": "mc"
        },
        {
            "ssid": "school",
            "bitrates": "efrff",
            "address": "rvvrrvv",
            "channel": "433434f",
            "encrypted": "wpa2",
            "encryption_type": "efff",
            "frequency": "34",
            "mode": "gta",
            "quality": "vice city",
            "signal": "good",
            "noice": "mc"
        },
        {
            "ssid": "3.14ZDA",
            "bitrates": "efrff",
            "address": "rvvrrvv",
            "channel": "433434f",
            "encrypted": "wpa2",
            "encryption_type": "efff",
            "frequency": "34",
            "mode": "gta",
            "quality": "s4",
            "signal": "good",
            "noice": "mc"
        }
    ]
}

export const bt = {
    bt_devices: [
        {
            "mac_addr": "87:8989:erf:89",
            "name": "bt_best"
        },
        {
            "mac_addr": "87:859:erf:00",
            "name": "bt_good"
        },
        {
            "mac_addr": "00:89:erf:00",
            "name": "bt_average"
        },

    ]
}
