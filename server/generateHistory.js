import simpleGit from "simple-git";
import fs from "fs";

const git = simpleGit();

// All server files
const files = [
  ".env",
  ".gitignore",
  "data.json",
  "index.js",
  "package-lock.json",
  "package.json",
  "src/config/cloudinary-l.js",
  "src/config/db-connection.js",
  "src/config/passport.js",
  "src/config/stripe.js",
  "src/controllers/adminControllers.js",
  "src/controllers/authControllers.js",
  "src/controllers/categoryControllers.js",
  "src/controllers/certificateController.js",
  "src/controllers/courseController.js",
  "src/controllers/dashboardController.js",
  "src/controllers/enrollementControllers.js",
  "src/controllers/geminiCotrollers.js",
  "src/controllers/lessonControllers.js",
  "src/controllers/reviewControllers.js",
  "src/controllers/userController.js",
  "src/middlewares/authMiddleware.js",
  "src/middlewares/upload-video.js",
  "src/middlewares/upload.js",
  "src/models/catagory.js",
  "src/models/course.js",
  "src/models/earning.js",
  "src/models/enrollment.js",
  "src/models/lesson.js",
  "src/models/reviewModel.js",
  "src/models/userModel.js",
  "src/routes/adminRoutes.js",
  "src/routes/authRoutes.js",
  "src/routes/categoryRoutes.js",
  "src/routes/certificateRoutes.js",
  "src/routes/courseRoute.js",
  "src/routes/dashboardRoutes.js",
  "src/routes/enrollementRoutes.js",
  "src/routes/geminiAiRoutes.js",
  "src/routes/lessonRoutes.js",
  "src/routes/reviewRoutes.js",
  "src/routes/userRoute.js",
  "src/templates/verifyEmail.ejs",
  "src/utils/cloudinary.js",
  "src/utils/multer.js",
  "src/utils/sendEmail.js",
  "src/utils/verificationEmail.js",
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateHistory() {
  let start = new Date("2024-10-20");

  for (let day = 0; day < 14; day++) {
    let commitDate = new Date(start);
    commitDate.setDate(commitDate.getDate() + day);

    const commitCount = random(1, 5);
    console.log(
      `\n📅 Creating ${commitCount} commits for ${commitDate.toISOString().split("T")[0]}`
    );

    for (let c = 1; c <= commitCount; c++) {
      const randomFile = files[random(0, files.length - 1)];

      // touch file artificially to trigger changes
      fs.appendFileSync(randomFile, `\n// Auto change for ${commitDate}`);

      const timestamp = new Date(commitDate);
      timestamp.setHours(10, c, 0);

      await git.add(".");
      await git.commit(
        `Update: ${randomFile} - commit ${c}`,
        { "--date": timestamp.toISOString() }
      );
    }
  }

  console.log("\n✅ Commit history generated successfully!");
}

generateHistory().catch(console.error);
