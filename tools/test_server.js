const http = require('http');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 3344;

const outDir = `./test_logs/`;
try {
    fs.accessSync(outDir);
} catch (err) {
    fs.mkdir(outDir, (err) => console.error('Error creating log directory:', err));
}

let outFile;
for (let i = 0; ; i++) {
    outFile = outDir + i + '.txt';
    try {
        fs.accessSync(outFile);
    } catch (err) {
        break;
    }
}

const outStream = fs.createWriteStream(outFile);
outStream.on('error', (err) => console.error('Error writing to log file:', err));

function log(msg) {
    if (msg !== undefined) {
        msg = msg.toString();
        console.log(msg);
        outStream.write(msg);
    } else {
        console.log();
    }
    outStream.write('\n');
}

const server = http.createServer((req, res) => {
    log();

    if (req.method.toUpperCase() !== 'POST') {
        res.writeHead(404).end();
        return;
    }

    let rawData = '';
    req.on('data', (chunk) => {
        rawData += chunk;
    });
    req.on('end', () => {
        log(`${req.method} ${req.url}`);
        try {
            const parsedData = JSON.parse(rawData);
            log('Body (json):');
            log(JSON.stringify(parsedData, null, 4));
        } catch {
            log('Body (unknown format):');
            log(rawData);
        }
        res.writeHead(200).end();
    });
});

server.listen(port, hostname, () => {
    log(`All logs are being saved to ${outFile}`);
    log(`Server running at http://localhost:${port}/`);
});
