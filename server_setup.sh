#!/bin/bash

# Exit if the server directory does not exist
if [ ! -d "server" ]; then
    echo "Error: 'server' directory does not exist."
    exit 1
fi

# Create subdirectories
mkdir -p server/config
mkdir -p server/controllers
mkdir -p server/middleware
mkdir -p server/models
mkdir -p server/routes

# Create files
touch server/config/db.js

touch server/controllers/authController.js
touch server/controllers/propertyController.js

touch server/middleware/authMiddleware.js

touch server/models/User.js
touch server/models/Property.js

touch server/routes/authRoutes.js
touch server/routes/propertyRoutes.js

touch server/.env
touch server/.gitignore
touch server/server.js

echo "Server structure created successfully!"
