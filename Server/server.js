const express=require("express");
const cors = require('cors');
const PORT=5000;
require('dotenv').config();


const app=express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const { createTable, addRowToTable, updateRowInTable, deleteRowFromTable, getAllTableNames, getTableColumns, getTableData } = require('./query.js');



app.post('/createtable', async (req, res) => {
    const { tableName, columns } = req.body;
  
    if (!tableName || !Array.isArray(columns) || columns.length === 0) {
        return res.status(400).send('Invalid input');
    }

    try {
        await createTable(tableName, columns);
        res.status(200).send('Table created successfully');
    } catch (error) {
        res.status(500).send(`Error creating table: ${error.message}`);
    }
});

app.post('/addrow/:tableName', async (req, res) => {
    const { tableName } = req.params;
    const newData = req.body;

    const result = await addRowToTable(tableName, newData);
    if (result.success) {
        res.status(201).send(result.message);
    } else {
        res.status(500).send(result.message);
    }
});

app.put('/updateRow/:tableName/:id', async (req, res) => {
    console.log("hello")
    const { tableName, id } = req.params;
    const newData = req.body;
    

    const result = await updateRowInTable(tableName, id, newData);
    if (result.success) {
        res.status(200).send(result.message);
    } else {
        res.status(500).send(result.message);
    }
});


app.delete('/deleterow/:tableName/:id', async (req, res) => {
    const { tableName, id } = req.params; 
    const result = await deleteRowFromTable(tableName, id);
    if (result.success) {
        res.status(200).send(result.message);
    } else {
        res.status(500).send(result.message);
    }
});


app.get('/gettable', async (req, res) => {
    try {
        const tables = await getAllTableNames();
        res.json(tables);
    } catch (error) {
        console.error('Error fetching table names:', error);
        res.status(500).send('Error fetching table names');
    }
});

app.get('/gettable/:tableName', async (req, res) => {
    const { tableName } = req.params;
    console.log(tableName);
    try {
        const columns = await getTableColumns(tableName);
        res.json(columns);
    } catch (error) {
        console.error(`Error fetching columns for table ${tableName}:`, error);
        res.status(500).send(`Error fetching columns for table ${tableName}`);
    }
});


app.get('/gettabledata/:tableName', async (req, res) => {
    const { tableName } = req.params;
    try {
        const tableData = await getTableData(tableName);
        res.json(tableData);
    } catch (error) {
        console.error(`Error fetching data for table ${tableName}:`, error);
        res.status(500).send(`Error fetching data for table ${tableName}`);
    }
});

app.listen(PORT,()=>{
console.log("server is working")});