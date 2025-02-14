import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function findOrCreateUser(profile: any) {
  try {
    const existing = await pool.query(
      `SELECT * FROM users WHERE google_sub = $1 LIMIT 1`,
      [profile?.sub]
    );

    if (existing.rowCount === 0) {
      // If new, insert the user
      await pool.query(
        `INSERT INTO users (google_sub, email, display_name)
         VALUES ($1, $2, $3)`,
        [profile?.sub, profile?.email, profile?.name]
      );
    }

    return true;
  } catch (error) {
    console.error("Database error in findOrCreateUser:", error);
    return false;
  }
}
