# Create a Virtual Environment

- Firstly Create Virtual Environment.
``` python3 -m venv .env ```

- After creating the .env file invoke the venv.
``` source .env/bin/activate ```


# Start Flask App.

- Install all the dependices needed in order to run this project
- All the required modules are in requirements.txt file
- We will use pip to install
``` pip install -r requirements.txt ```

- After installing all the modules we are ready to run the flask project.
``` python app.py ```
- The web-page will be servered on localhost port 5000.


# Start redis-server at port 6379 to serve cache files.
- Start the Redis server as a background process using the systemctl command.
``` sudo systemctl start redis-server ```

- Make sure it runs in background in order to keep the redis cache work in flask cache.

- To stop the service, use:
``` sudo systemctl stop redis-stack-server ```


# Flask Cache
- 2 mins cache timeout set for User ~ Home, Explore, Category
- 1 mins cache timeout set for Librarian ~ Dashboard


# Celery
- To run celery workers:
* Make sure *Redis Server * is up and running
``` celery -A controllers.celery.workers.celery  worker --loglevel=INFO ```


- To run celery workers and call task within command line:
* Make sure *Redis Server * is up and running

``` celery -A controllers.celery.workers.celery call controllers.celery.tasks.call_every_day --kwargs='{"name":"ranjit"}' ```

- To run celery beat:
* Make sure *Redis Server * is up and running
``` celery -A controllers.celery.workers.celery beat --max-interval 1 -l info ```
- --max-interval: The beat will check for incoming tasks every 1 second interval.
- -l info: For logging info on the terminal.
