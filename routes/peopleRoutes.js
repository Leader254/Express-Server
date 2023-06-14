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
import { register, login, isLoggedIn } from "../controllers/userControllers.js";

const router = express.Router();

router.route("/people").get(getAllPeople).post(createPerson);

router
  .route("/people/:id")
  .get(getPersonById)
  .put(updatePerson)
  .delete(deletePerson);

router.get("/peopleName/:name", getPersonByName);

router.route("/register").get(register).post(register);

router.route("/login").post(login);

export default router;
