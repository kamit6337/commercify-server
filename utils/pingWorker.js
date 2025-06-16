import axios from "axios";

const pingWorker = async () => {
  try {
    await axios.get(`https://commercify-worker.onrender.com`);

    console.log("Worker ping successfully");
  } catch (error) {
    console.log("Error in Worker ping", error);
  }
};

export default pingWorker;
