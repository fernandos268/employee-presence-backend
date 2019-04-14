
// GRAPQL MODELS
const Event = require('../../models/event');

//MERGE FUNCTIONS
const { transformEvent } = require('./merge')


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5cb04a587838a366e950a4e4'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById('5cb04a587838a366e950a4e4');

            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

};