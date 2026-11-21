import express from "express";
import { configureApp } from "../server/app.js";

export default configureApp(express());
