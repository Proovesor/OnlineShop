const express = require('express');

const app = express();

// app.use((req, res, next) => {
//     console.log("first mw");
//     next();
// })

// app.use((req, res, next) => {
//     console.log("second mw");
//     res.send(`<h1>HTML no1</h1>`);
// })

app.use('/users', (req, res, next) => {
    console.log(`users`);
    res.send(`I'm here at the users url.`);
})

app.use('/', (req, res, next) => {
    console.log(`notUsers`);
    res.send(`I'm here at the universal url.`);
})


app.listen(3000);