var RoomCreated = function (args) {
    server.WriteTitleEvent({
        EventName: "room_created"
    });
    return { ResultCode: 0, Message: 'Success' };
};
handlers["RoomCreated"] = RoomCreated;
var RoomJoined = function (args) {
    server.WriteTitleEvent({
        EventName: "room_joined"
    });
    return { ResultCode: 0, Message: 'Success' };
};
handlers["RoomJoined"] = RoomJoined;
var RoomLeft = function (args) {
    server.WriteTitleEvent({
        EventName: "room_left"
    });
    return { ResultCode: 0, Message: 'Success' };
};
handlers["RoomLeft"] = RoomLeft;
var RoomClosed = function (args) {
    server.WriteTitleEvent({
        EventName: "room_closed"
    });
    return { ResultCode: 0, Message: 'Success' };
};
handlers["RoomClosed"] = RoomClosed;
var RoomPropertyUpdated = function (args) {
    server.WriteTitleEvent({
        EventName: "room_property_changed"
    });
    return { ResultCode: 0, Message: 'Success' };
};
handlers["RoomPropertyUpdated"] = RoomPropertyUpdated;
var RoomEventRaised = function (args) {
    server.WriteTitleEvent({
        EventName: "room_event_raised"
    });
    return { ResultCode: 0, Message: 'Success' };
};
handlers["RoomEventRaised"] = RoomEventRaised;
//# sourceMappingURL=PhotonRoomHook.js.map