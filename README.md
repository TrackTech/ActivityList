# Activity Website
  The goal of the application is to record activities performed outside of gym and work. This is web base application running on GCP. The website does not have any dynamic content. All pages are static html pages and data is fetched from nodejs backend. The application uses NGINX as a proxy server , NodeJS backed server (upstream to proxy) and Mongodb as data store.

# Prerequisites
  * Ubuntu 16.04 LTS (Xenial)
  * NodeJS 7.10.1   (node -v)
  * Nginx 1.12.2    (nginx -v)
  * Mongodb 3.4.10  (db.version())
 
# Installing
  Using terminal [use sudo when required]
  * mkdir Projects
  * cd /Projects
  * mkdir ActivityProject
  * mkdir NodeJsServer
  * cd ActivityProject
  * pwd 
    * /Project/ActivityProject
  * Fetch source code from GitHub
    * Git init
    * git remote add origin https://github.com/TrackTech/ActivtyList.git
    * git pull origin Dev01012018 (current branch)
  * cd NodeSource
  * sudo cp *.* ../../NodeJsServer/
  * npm install
    * This will reach the package.json file and intall all dependencies for NodeJs

# Deployment
# Staring various processes
  * sudo service nginx start
    * sudo service nginx status
  * sudo service start mongod
    * sudo service status mongod
  * pm2 start main.js
    * pm2 list
  
  
