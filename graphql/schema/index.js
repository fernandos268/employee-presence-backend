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
    email: String!
    password: String
    createdEvents:[Event!]
}

type SigninResponse {
    userId:ID!
    token: String!
    tokenExpiration: Int!
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
    timeTO: String!
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
    email: String!
    password: String!
}

input DayOffInput {
    dateFrom: String!
    dateTo: String!
    description: String!
    status: String!
}

input updateDayOffInput {
    _id: ID!
    dateFrom: String!
    dateTo: String!
    description: String!
    status: String!
}

input OvertimeInput {
    date: String!
    timeFrom:String!
    timeTO:String!
    description: String!
    status: String!
}

input UpdateOvertimeInput {
    _id: ID!
    date: String!
    timeFrom:String!
    timeTO:String!
    description: String!
    status: String!
}

type RootQuery {
    events: [Event!]!
    bookings:[Booking!]!
    signin(email:String!,password:String!): SigninResponse
    dayoffs:[DayOff!]!
    overtimes:[Overtime!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event!
    createUser(userInput: UserInput): User!

    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!

    createDayOff(dayoffInput: DayOffInput): DayOff!
    deleteDayOff(dayOffId: ID!): DayOff!
    updateDayOff(updateDayOffInput: updateDayOffInput): DayOff!

    createOvertime(overtimeInput: OvertimeInput): Overtime
    deleteOvertime(overtimeId: ID!): Overtime!
    updateOvertime(updateOvertimeInput: UpdateOvertimeInput ): Overtime!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
