const app = require('./app.js');
const {connectDB} = require('./data/connection.js');

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
});