const http = require('http');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 3344;

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
};

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
    msg = msg.toString();
    console.log(msg);
    outStream.write(msg + '\n');
}

const server = http.createServer((req, res) => {
    let rawData = '';
    req.on('data', (chunk) => {
        rawData += chunk;
    });
    req.on('end', () => {
        if (req.method.toUpperCase() != 'OPTIONS') {
            log(`\n${req.method} ${req.url}`);
            try {
                const parsedData = JSON.parse(rawData);
                log('Body (json):');
                log(JSON.stringify(parsedData, null, 4));
            } catch {
                log('Body (unknown format):');
                log(rawData);
            }
        }
        res.writeHead(200, headers).end();
    });
});

server.listen(port, hostname, () => {
    log(`All logs are being saved to ${outFile}`);
    log(`Server running at http://localhost:${port}/`);
});
