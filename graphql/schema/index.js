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
    firstName: String
    lastName: String
    suffix: String
    email: String!
    username: String!
    password: String
    isAdmin:Boolean!
    createdEvents:[Event!]
    createdDayOffs: [DayOff!]
    createdOvertimes:[Overtime!]
    assignedOvertimes:[Overtime!]
    assignedDayOffs: [DayOff!]
}

type SigninResponse {
    userId:ID
    token: String
    tokenExpiration: Int
    ok:Boolean!
    errors:[Error!]
}

type SignupResponse {
    user:User
    ok:Boolean!
    errors:[Error!]
}

type Error {
    path: String!
    message: String
}

type DayOff {
    _id: ID!
    startDate: String!
    endDate: String!
    duration: String!
    description: String!
    creator: User!
    approver: User!
    status: String!
}

type Overtime {
    _id: ID!
    date:String!
    startTime: String!
    endTime: String!
    duration: String!
    description: String!
    creator: User!
    approver: User!
    status: String!
}

type OvertimeResponse {
    ok:Boolean!
    errors:[Error!]
    overtime: Overtime
}

type DayOffResponse {
    ok:Boolean!
    errors:[Error!]
    dayoff: DayOff
}

type queryUserResponse {
    ok:Boolean!
    errors:[Error!]
    user:User
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
    startDate: String!
    endDate: String!
    duration:String!
    description: String!
    status: String!
    approverId: ID!
}

input OvertimeInput {
    date:String!
    startTime: String!
    endTime: String!
    duration: String!
    description: String!
    status: String!
    approverId: ID!
}

type RootQuery {
    events: [Event!]!
    bookings:[Booking!]!
    users: [User!]!
    fetchUser(userId: ID!): queryUserResponse!
    dayoffs:[DayOff!]!
    overtimes:[Overtime!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event!

    createUser(userInput: UserInput): SignupResponse!
    signin(email:String!,password:String!): SigninResponse!

    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!

    createOvertime(overtimeInput: OvertimeInput): OvertimeResponse!
    deleteOvertime(overtimeId: ID!): OvertimeResponse!
    updateOvertime(overtimeId: ID!, status: String!): OvertimeResponse!

    createDayOff(dayoffInput: DayOffInput): DayOffResponse!
    deleteDayOff(dayOffId: ID!): DayOffResponse!
    updateDayOff(dayOffId: ID!, status: String!): DayOffResponse!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
