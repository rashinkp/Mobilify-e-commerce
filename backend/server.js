import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();


const app = express();


app.use(cors()); // enable cors for all origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




const port = process.env.PORT || 4000;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})