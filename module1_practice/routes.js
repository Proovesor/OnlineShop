const handler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/') {
        res.setHeader('Content-type', 'text/html');
        res.write('<html><head><title>Stronka</title></head><body><h1 align="center">Welcome to my page!</h1>');
        res.write('<form align="center" action="/create-user" method="POST">Username: <input type="text" name="username"><br><br>Gender: <input type="text" name="gender"><br><br><button type="submit">Send</button></form></body></html>');

        return res.end();
    }

    else if(url === '/users') {
        res.write('<html><head><title>Stronka</title></head><body><ul><li>Dziobak</li><li>Pepe</li></ul></body></html>');

        return res.end();
    }

    else if(url === '/create-user' && method === 'POST') {
        const body = [];

        req.on('data', chunk => {
            body.push(chunk);
            console.log(chunk);
        });

        return req.on('end', () => {
                const parsedBody = Buffer.concat(body).toString();
                const inputData = parsedBody.split('&');
                const username = inputData[0].split('=')[1];
                const gender = inputData[1].split('=')[1];
                console.log(`Username: ${username}\n`, `Gender: ${gender}`);

                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
        });
    }

    res.setHeader('Content-type', 'text/html');
    res.write('<h1 align="center">Page not found.</h1>');

    res.end();
};

module.exports = handler;