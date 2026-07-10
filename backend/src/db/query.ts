import database from "./connection.ts";

const databaseAvailable = async (): Promise<boolean> => {
  try {
    await database().execute(
      `SELECT current_timestamp - pg_postmaster_start_time();`,
    );
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};

export { databaseAvailable };
