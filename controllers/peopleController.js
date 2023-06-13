import config from "../db/config.js";
import sql from "mssql";

// Get all people
export const getAllPeople = async (req, res) => {
  try {
    const pool = await sql.connect(config.sql);
    const result = await pool.request().query("SELECT * FROM dbo.personelData");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get person by ID
export const getPersonById = async (req, res) => {
  const personId = req.params.id;

  try {
    const pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", personId)
      .query("SELECT * FROM dbo.personelData WHERE id = @id");

    if (result.recordset.length > 0) {
      const person = result.recordset[0];
      res.json(person);
    } else {
      res.status(404).json({ message: "Person not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get person by name
export const getPersonByName = async (req, res) => {
  const name = req.params.name;

  try {
    const pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .query(
        "SELECT * FROM dbo.personelData WHERE first_name = @name OR last_name = @name"
      );

    if (result.recordset.length > 0) {
      const person = result.recordset;
      res.json(person);
    } else {
      res.status(404).json({ message: "Person not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a person
export const createPerson = async (req, res) => {
  const newPerson = req.body;

  try {
    const pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.Int, newPerson.id)
      .input("first_name", sql.VarChar, newPerson.first_name)
      .input("last_name", sql.VarChar, newPerson.last_name)
      .input("email", sql.VarChar, newPerson.email)
      .input("gender", sql.VarChar, newPerson.gender)
      .query(
        "INSERT INTO dbo.personelData (id, first_name, last_name, email, gender) VALUES (@id, @first_name, @last_name, @email, @gender)"
      );

    if (result.rowsAffected.length > 0) {
      res.status(201).json({ message: "Person created successfully" });
    } else {
      res.status(500).json({ message: "There was a problem creating the person" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a person
export const updatePerson = async (req, res) => {
  const id = req.params.id;
  const updatedPerson = req.body;

  try {
    const pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.Int, updatedPerson.id)
      .input("first_name", sql.VarChar, updatedPerson.first_name)
      .input("last_name", sql.VarChar, updatedPerson.last_name)
      .input("email", sql.VarChar, updatedPerson.email)
      .input("gender", sql.VarChar, updatedPerson.gender)
      .query(
        "UPDATE dbo.personelData SET id = @id, first_name = @first_name, last_name = @last_name, email = @email, gender = @gender WHERE id = @id"
      );

    if (result.rowsAffected[0] === 1) {
      res.status(200).json({ message: "Person updated successfully" });
    } else {
      res.status(500).json({ message: "There was a problem updating the person" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a person
export const deletePerson = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM dbo.personelData WHERE id = @id");

    if (result.rowsAffected[0] === 1) {
      res.status(200).json({ message: "Person deleted successfully" });
    } else {
      res.status(500).json({ message: "There was a problem deleting the person" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
