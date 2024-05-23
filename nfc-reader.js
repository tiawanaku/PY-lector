const { NFC } = require('nfc-pcsc');

const nfc = new NFC(); // Crear instancia de NFC

nfc.on('reader', reader => {
    console.log(`${reader.reader.name} device attached`);

    reader.on('card', card => {
        console.log(`Card detected: ${card.uid}`);

        // Comando para leer 64 bytes desde el bloque 0
        const readCommand = [0xFF, 0xB0, 0x00, 0x00, 64]; 

        reader.transmit(Buffer.from(readCommand), 40)
            .then(response => {
                console.log('Data read', response.toString('utf8'));
            })
            .catch(err => {
                console.error('Error:', err);
            });
    });

    reader.on('error', err => {
        console.error(`${reader.reader.name} device error`, err);
    });

    reader.on('end', () => {
        console.log(`${reader.reader.name} device removed`);
    });
});

nfc.on('error', err => {
    console.error('NFC error:', err);
});
