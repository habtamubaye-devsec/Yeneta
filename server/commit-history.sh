#!/bin/bash

# Files for commit messages
files=(
".env"
".gitignore"
"data.json"
"index.js"
"package-lock.json"
"package.json"
"src/config/cloudinary-l.js"
"src/config/db-connection.js"
"src/config/passport.js"
"src/config/stripe.js"
"src/controllers/adminControllers.js"
"src/controllers/authControllers.js"
"src/controllers/categoryControllers.js"
"src/controllers/certificateController.js"
"src/controllers/courseController.js"
"src/controllers/dashboardController.js"
"src/controllers/enrollementControllers.js"
"src/controllers/geminiCotrollers.js"
"src/controllers/lessonControllers.js"
"src/controllers/reviewControllers.js"
"src/controllers/userController.js"
"src/middlewares/authMiddleware.js"
"src/middlewares/upload-video.js"
"src/middlewares/upload.js"
"src/models/catagory.js"
"src/models/course.js"
"src/models/earning.js"
"src/models/enrollment.js"
"src/models/lesson.js"
"src/models/reviewModel.js"
"src/models/userModel.js"
"src/routes/adminRoutes.js"
"src/routes/authRoutes.js"
"src/routes/categoryRoutes.js"
"src/routes/certificateRoutes.js"
"src/routes/courseRoute.js"
"src/routes/dashboardRoutes.js"
"src/routes/enrollementRoutes.js"
"src/routes/geminiAiRoutes.js"
"src/routes/lessonRoutes.js"
"src/routes/reviewRoutes.js"
"src/routes/userRoute.js"
"src/templates/verifyEmail.ejs"
"src/utils/cloudinary.js"
"src/utils/multer.js"
"src/utils/sendEmail.js"
"src/utils/verificationEmail.js"
)

start_date="2024-10-20"

for i in {0..13}; do
    day=$(date -d "$start_date + $i day" +%Y-%m-%d)

    commits=$(( RANDOM % 5 + 1 ))

    echo "Creating $commits commits for $day"

    for ((c=1; c<=commits; c++)); do
        random_file=${files[$RANDOM % ${#files[@]}]}
        
        echo "$day - commit $c modifying $random_file" >> fake_change.log

        git add .
        GIT_AUTHOR_DATE="$day 10:0$c:00" GIT_COMMITTER_DATE="$day 10:0$c:00" \
        git commit -m "Update: $random_file - automated commit $c on $day"
    done
done
