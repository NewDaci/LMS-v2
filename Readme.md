# Create a Virtual Environment

- Firstly Create Virtual Environment.
``` python3 -m venv .env ```

- After creating the .env file invoke the venv.
``` source .env/bin/activate ```


# How to start backend server Flask App for API calls.

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

<hr>

# Flask Cache
- 2 mins cache timeout set for User ~ Home, Explore, Category
- 1 mins cache timeout set for Librarian ~ Dashboard
