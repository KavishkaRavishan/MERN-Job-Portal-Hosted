require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, "/client/dist")));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal.n1p8ehz.mongodb.net/?retryWrites=true&w=majority&appName=job-portal`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    //create DB
    const db = client.db("mernJobPortal");
    const jobsCollections = db.collection("demoJobs");
    const applicationsCollections = db.collection("jobApplications");

    //post a job
    app.post("/post-job", async (req, res) => {
      const body = req.body;
      body.createAt = new Date();
      //console.log(body);
      const result = await jobsCollections.insertOne(body);
      if (result.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "cannot insert! try again later",
          status: false,
        });
      }
    });

    //get all jobs
    app.get("/all-jobs", async (req, res) => {
      const jobs = await jobsCollections.find({}).toArray();
      res.send(jobs);
    });

    //get single job using id
    app.get("/all-jobs/:id", async (req, res) => {
      const id = req.params.id;
      const job = await jobsCollections.findOne({
        _id: new ObjectId(id),
      });
      res.send(job);
    });

    //get jobs by email
    app.get("/myJobs/:email", async (req, res) => {
      //console.log(req.params.email);
      const jobs = await jobsCollections
        .find({ postedBy: req.params.email })
        .toArray();
      res.send(jobs);
    });

    //delete a job
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await jobsCollections.deleteOne(filter);
      res.send(result);
    });

    //update a job
    app.patch("/update-job/:id", async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...jobData,
        },
      };
      const result = await jobsCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //submit job application
    app.post("/apply-job", async (req, res) => {
      const applicationData = req.body;
      applicationData.appliedAt = new Date();
      
      try {
        // Check if user already applied for this job
        const existingApplication = await applicationsCollections.findOne({
          jobId: applicationData.jobId,
          applicantEmail: applicationData.applicantEmail
        });
        
        if (existingApplication) {
          return res.status(400).send({
            message: "You have already applied for this job",
            status: false,
          });
        }
        
        const result = await applicationsCollections.insertOne(applicationData);
        if (result.insertedId) {
          return res.status(200).send({
            message: "Application submitted successfully",
            status: true,
            result: result
          });
        } else {
          return res.status(404).send({
            message: "Failed to submit application. Please try again.",
            status: false,
          });
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        return res.status(500).send({
          message: "Internal server error",
          status: false,
        });
      }
    });

    //get applications for a specific job
    app.get("/job-applications/:jobId", async (req, res) => {
      const jobId = req.params.jobId;
      try {
        const applications = await applicationsCollections
          .find({ jobId: jobId })
          .sort({ appliedAt: -1 })
          .toArray();
        res.send(applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send({
          message: "Failed to fetch applications",
          status: false,
        });
      }
    });

    //get applications by job owner email
    app.get("/my-applications/:email", async (req, res) => {
      try {
        // First get all jobs posted by this user
        const userJobs = await jobsCollections
          .find({ postedBy: req.params.email })
          .toArray();
        
        // Get job IDs
        const jobIds = userJobs.map(job => job._id.toString());
        
        // Get all applications for these jobs
        const applications = await applicationsCollections
          .find({ jobId: { $in: jobIds } })
          .sort({ appliedAt: -1 })
          .toArray();
        
        // Combine application data with job data
        const applicationsWithJobData = applications.map(app => {
          const job = userJobs.find(job => job._id.toString() === app.jobId);
          return {
            ...app,
            jobTitle: job?.jobTitle || "Unknown Job",
            companyName: job?.companyName || "Unknown Company"
          };
        });
        
        res.send(applicationsWithJobData);
      } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send({
          message: "Failed to fetch applications",
          status: false,
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Serve index.html for all other routes (SPA support)
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "/client/dist/index.html"));
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});