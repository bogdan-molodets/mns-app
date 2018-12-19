export class Target {
    /**
     *
     */
    constructor(readonly target_id: string,
        readonly X0: number,
        readonly Y0: number,
        readonly H0: number,
        readonly HA: string,
        readonly VA: string,
        readonly dX: number,
        readonly dY: number,
        readonly dH: number,
        readonly last_upd: string
    ) {


    }
}

export class TargetSerializer {
    deserialize(input: any) {
        return new Target(input.target_id,
            input.X0,
            input.Y0,
            input.H0,
            input.HA,
            input.VA,
            input.dX,
            input.dY,
            input.dH,
            input.last_upd)
    }
}