import sql from 'mssql';

// Production database
export const dbQueryPROD = async (text) => {
    try {
        await sql.connect('');
        const result = await sql.query(text);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
    }
}

// Development/backup database for testing
export const dbQueryDEV = async (text) => {
    try {
        await sql.connect(''); // connection string removed for security reasons
        const result = await sql.query(text);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
    }
}
