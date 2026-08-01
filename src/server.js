require('dotenv').config();

const app = require('./app')

const connectDB = require('./config/dbCred');

const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();