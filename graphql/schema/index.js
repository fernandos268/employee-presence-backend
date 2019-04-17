const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Booking {
    _id:ID!
    event: Event!
    user: User!
    createdAt:String!
    updatedAt:String!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User {
    _id: ID!
    firstName: String!
    lastName: String!
    suffix: String
    email: String!
    username: String!
    password: String
    isAdmin:Boolean!
    createdEvents:[Event!]
    createdDayOffs: [DayOff!]
    createdOvertimes:[Overtime!]
}

type SigninResponse {
    userId:ID
    token: String
    tokenExpiration: Int
    ok:Boolean!
    errors:[Error!]
}

type SignupResponse {
    email:String
    ok:Boolean!
    errors:[Error!]
}

type Error {
    path: String!
    message: String
}

type DayOff {
    _id: ID!
    dateFrom: String!
    dateTo: String!
    description: String!
    creator: User!
    status: String!
}

type Overtime {
    _id: ID!
    date: String!
    timeFrom: String!
    timeTo: String!
    description: String!
    creator: User!
    status: String!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    firstName: String!
    lastName:String!
    suffix:String
    email: String!
    username: String!
    password: String!
    isAdmin:Boolean!
}

input DayOffInput {
    dateFrom: String!
    dateTo: String!
    description: String!
    status: String!
}

input UpdateDayOffInput {
    _id: ID!
    status: String!
}

input OvertimeInput {
    date: String!
    timeFrom: String!
    timeTo: String!
    description: String!
    status: String!
}

input UpdateOvertimeInput {
    _id: ID!
    status: String!
}

type RootQuery {
    events: [Event!]!
    bookings:[Booking!]!
    users: [User!]!
    dayoffs:[DayOff!]!
    overtimes:[Overtime!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event!

    createUser(userInput: UserInput): SignupResponse!
    signin(email:String!,password:String!): SigninResponse!

    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!

    createDayOff(dayoffInput: DayOffInput): DayOff!
    deleteDayOff(dayOffId: ID!): DayOff!
    updateDayOff(updateDayOffInput: UpdateDayOffInput): DayOff!

    createOvertime(overtimeInput: OvertimeInput): Overtime!
    deleteOvertime(overtimeId: ID!): Overtime!
    updateOvertime(updateOvertimeInput: UpdateOvertimeInput ): Overtime!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
