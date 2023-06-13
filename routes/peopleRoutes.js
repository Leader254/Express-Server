// src/routes/peopleRoutes.js
import express from "express";
import {
  getAllPeople,
  getPersonById,
  getPersonByName,
  createPerson,
  updatePerson,
  deletePerson,
} from "../controllers/peopleController.js";

const router = express.Router();

router.route("/people")
  .get(getAllPeople)
  .post(createPerson);

router.route("/people/:id")
  .get(getPersonById)
  .put(updatePerson)
  .delete(deletePerson);

router.get("/peopleName/:name", getPersonByName);
export default router;
