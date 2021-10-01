interface IPhotonRequest {
    inputValue?: any
}
interface IPhotonResult {
    ResultCode: number
    Message: string
}

var RoomCreated = function (args: IPhotonRequest): IPhotonResult {
    server.WriteTitleEvent({
        EventName: "room_created"
    });

    return { ResultCode: 0, Message: 'Success' };
};
handlers["RoomCreated"] = RoomCreated;

var RoomJoined = function (args: IPhotonRequest): IPhotonResult {
    server.WriteTitleEvent({
        EventName : "room_joined"
    });

    return { ResultCode : 0, Message: 'Success' };
};
handlers["RoomJoined"] = RoomJoined;

var RoomLeft = function (args: IPhotonRequest): IPhotonResult {
    server.WriteTitleEvent({
        EventName : "room_left"
    });

    return { ResultCode : 0, Message: 'Success' };
};
handlers["RoomLeft"] = RoomLeft;

var RoomClosed = function (args: IPhotonRequest): IPhotonResult {
    server.WriteTitleEvent({
        EventName : "room_closed"
    });

    return { ResultCode : 0, Message: 'Success' };
};
handlers["RoomClosed"] = RoomClosed;

var RoomPropertyUpdated = function (args: IPhotonRequest): IPhotonResult {
    server.WriteTitleEvent({
        EventName : "room_property_changed"
    });

    return { ResultCode : 0, Message: 'Success' };
};
handlers["RoomPropertyUpdated"] = RoomPropertyUpdated;

var RoomEventRaised = function (args: IPhotonRequest): IPhotonResult {
    server.WriteTitleEvent({
        EventName : "room_event_raised"
    });

    return { ResultCode : 0, Message: 'Success' };
};
handlers["RoomEventRaised"] = RoomEventRaised;