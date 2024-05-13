const express = require('express');
const db = require("../database");
const validator = require('validator');
const session = require("express-session");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const xlsx = require('xlsx');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');

function checkSession(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized: You must be logged in to access this route');
    }
}

router.post('/', upload.single('file'), (req, res) => {

    const workbook = xlsx.readFile(req.file.path);
    const sheetNameList = workbook.SheetNames;
    const df = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

    // Create an XML root element
    const root = xmlbuilder.create('Items');
    let xmlFile = "public/xml_export_without_prices.xml"
    // Iterate through each row in the DataFrame
    df.forEach((row, index) => {
        const item = root.ele('Item');

        // Add sub-elements for id, barcode, stock (qty), and price
        item.ele('id', {}, index + 1);
        item.ele('barcode', {}, parseInt(row['ean code']));

        // Check if stock is greater than 20
        if (row['QTY'] > 20) {
            item.ele('stock', {}, 20);
        } else {
            item.ele('stock', {}, parseInt(row['QTY']));
        }

        item.ele('model', {}, row['Material description']);

        // Check if "cena" column exists in the DataFrame and if prices should be included
        if (row.hasOwnProperty('Cena')) {
            item.ele('price', {}, row['Cena']);
            xmlFile = "public/xml_export_with_prices.xml"
        }
    });

    fs.writeFileSync(xmlFile, root.end({ pretty: true}));

    // Update the database with the file name and last updated time
    const now = new Date();
    db.run('INSERT OR IGNORE INTO files (file_name, last_updated) VALUES (?, ?)', [xmlFile, now], function(error) {
        if (error) throw error;
        db.run('UPDATE files SET last_updated = ? WHERE file_name = ?', [now, xmlFile], function(error) {
            if (error) throw error;
            // ...
        });
    });

    // Delete the uploaded file
    fs.unlinkSync(req.file.path);

    res.send({fileUrl: xmlFile});
});

// API endpoint to fetch the file records
router.get('/files', (req, res) => {
    db.all('SELECT * FROM files', function(error, results) {
        if (error) throw error;
        res.json(results);
    });
});

module.exports = router;