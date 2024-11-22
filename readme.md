### Running the Application with Docker Compose

To start the application using Docker Compose, run the following command:

```bash
docker-compose up -d
```

#### Explanation:
- `up`: Builds, (re)creates, and starts the containers as defined in the `docker-compose.yml` file.
- `-d`: Runs the containers in detached mode, allowing them to run in the background while freeing up your terminal.

After running this command, all the services will start in the background. You can check the running containers using:

```bash
docker ps
```

To stop the containers, use:

```bash
docker-compose down
```
