export class Session {
    /**
     *
     */
    constructor(readonly sessionId: string,
        readonly description: string,
        readonly lat: number,
        readonly lon: number,
        readonly hgt: number,
        readonly timestamp: string,
        readonly state: string,
        readonly tolerance: number,
    ) {


    }
}

export class SessionSerializer {
    deserialize(input: any) {
        return new Session(input.session_id,
            input.description,
            input.lat,
            input.lon,
            input.hgt,
            input.timestamp,
            input.state,
            input.tolerance)
    }
}