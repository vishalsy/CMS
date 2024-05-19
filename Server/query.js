
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    },
});

const getAllTableNames =async()=> {
    try {
        const result = await db.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        return result.rows.map(row => row.table_name);
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

const getTableColumns = async (tableName) => {
    try {
        const result = await db.raw(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = ?`, [tableName]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

const createTable = async (tableName, columns) => {
    try {
        await db.schema.createTable(tableName, table => {
            table.increments('id');

            columns.forEach(column => {
                let col;
                const type = column.type.toLowerCase();

                if (type.includes('int') && !type.includes('auto_increment')) {
                    col = table.integer(column.name);
                } else if (type.includes('varchar')) {
                    const length = type.match(/\(([^)]+)\)/);
                    col = table.string(column.name, length ? parseInt(length[1], 10) : 255);
                } else if (type.includes('timestamp')) {
                    col = table.timestamp(column.name).defaultTo(db.fn.now());
                } else if (!type.includes('auto_increment')) {
                    throw new Error(`Unsupported column type: ${column.type}`);
                }

                if (col) {
                    if (type.includes('not null')) {
                        col.notNullable();
                    }

                    if (type.includes('primary key')) {
                        col.primary();
                    }
                }
            });
        });

        console.log(`Table ${tableName} created successfully`);
    } catch (error) {
        console.error(`Error creating table ${tableName}:`, error);
        throw error;
    }
};


const addRowToTable = async (tableName, newData) => {
    try {
        const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, ''); 
        console.log(`Inserting into table: ${sanitizedTableName}`);
        console.log('Received Data:', newData);

        await db(sanitizedTableName).insert(newData)
        return { success: true, message: 'Row added successfully' };
    } catch (error) {
        return { success: false, message: `Error adding row to table ${tableName}: ${error.message}` };
    }
};

const getTableData = async (tableName) => {
    try {
        const result = await db(tableName).select('*');
        return result;
    } catch (error) {
        console.error(`Error fetching data from table ${tableName}:`, error);
        throw error;
    }
};

const updateRowInTable = async (tableName, id, newData) => {
    try {
        console.log(id);
        const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, ''); 
        await db(sanitizedTableName).where({ id }).update(newData);
        return { success: true, message: 'Row updated successfully' };
    } catch (error) {
        return { success: false, message: `Error updating row in table ${tableName}: ${error.message}` };
    }
};



const deleteRowFromTable = async (tableName, id) => {
    try {
        const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, ''); 
        await db(sanitizedTableName).where({ id }).del(); 
        return { success: true, message: 'Row deleted successfully' };
    } catch (error) {
        return { success: false, message: `Error deleting row from table ${tableName}: ${error.message}` };
    }
};


module.exports = { getTableData, createTable, addRowToTable, updateRowInTable, deleteRowFromTable, getAllTableNames, getTableColumns};
