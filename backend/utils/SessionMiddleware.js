import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import dotenv from 'dotenv';
//configuring dotenv 
dotenv.config();

//creating mongo db session store
const MongoDBStore = connectMongoDBSession(session);
export const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
});

//using express session middleware
export const sessionMiddleware = session({
    cookie: {
        secure: false,
        maxAge: 5000000000,
        httpOnly: false,
    },
    name: 'new2',
    secret: process.env.JWT_SECRET,
    saveUninitialized: false,
    resave: true,
    store: store,
})