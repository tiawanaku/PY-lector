const { NFC } = require('nfc-pcsc');

const nfc = new NFC(); // Crear instancia de NFC

nfc.on('reader', reader => {
    console.log(`${reader.reader.name} device attached`);

    reader.on('card', card => {
        console.log(`Card detected: ${card.uid}`);

        // Comando para escribir datos en la tarjeta
        const dataToWrite = Buffer.from('Hello World');
        const writeCommand = [0xFF, 0xD6, 0x00, 0x00, dataToWrite.length, ...dataToWrite];

        reader.transmit(Buffer.from(writeCommand), 40)
            .then(response => {
                console.log('Data written', response);

                // Comando para leer datos de la tarjeta
                const readCommand = [0xFF, 0xB0, 0x00, 0x00, dataToWrite.length];
                return reader.transmit(Buffer.from(readCommand), 40);
            })
            .then(response => {
                console.log('Data read', response.toString());
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
