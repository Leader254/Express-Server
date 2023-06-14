import sql from "mssql";
import config from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// create is logged in function
export const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401).json({ error: "User not authenticated" });
  }
};

export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("first_name", sql.VarChar, first_name)
      .input("last_name", sql.VarChar, last_name)
      .input("email", sql.VarChar, email)
      .query(
        "SELECT * FROM Customer WHERE first_name = @first_name OR last_name = @last_name OR email = @email"
      );
    const user = result.recordset[0];
    if (user) {
      res.status(409).json({ error: "User already exists" });
    } else {
      await pool
        .request()
        .input("first_name", sql.VarChar, first_name)
        .input("last_name", sql.VarChar, last_name)
        .input("email", sql.VarChar, email)
        .input("hashedpassword", sql.VarChar, hashedPassword)
        .query(
          "INSERT INTO Customer (first_name, last_name, email, customer_password) VALUES (@first_name, @last_name, @email, @hashedpassword)"
        );
      res.status(200).json({ message: "User Created Successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while creating the user" });
  } finally {
    sql.close();
  }
};

// login using email and password and also jwt
export const login = async (req, res) => {
  const { email, password } = req.body;
  let pool = await sql.connect(config.sql);
  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Customer WHERE email = @email");
  const user = result.recordset[0];
  if (!user) {
    res.status(404).json({ error: "User not found" });
  } else {
    if (!bcrypt.compareSync(password, user.customer_password)) {
      res.status(401).json({ error: "Incorrect password" });
    } else {
      const token = `JWT ${jwt.sign(
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
        config.jwt_secret
      )}`;
      res.status(200).json({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        token: token,
      });
    }
  }
};
