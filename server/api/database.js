import sql from 'mssql';

// Production database
export const dbQueryPROD = async (text) => {
    try {
        await sql.connect('Server=tcp:kc7f15r9f9.database.windows.net,1433;Database=PlateauDB;Uid=plateau_admin;Pwd=g0lden!CheekedWArbler;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;');
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
        await sql.connect('Server=tcp:kc7f15r9f9.database.windows.net,1433;Database=PlateauDB_Copy_Jan2023;Uid=plateau_admin;Pwd=g0lden!CheekedWArbler;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;');
        const result = await sql.query(text);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
    }
}
