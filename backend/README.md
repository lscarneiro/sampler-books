# Sampler Books Library Backend

This is the Backend part of the challenge.

After you clone the repo, go to `./backend` and execute:

```shell
$ cp .env.dev .env
```
To create the development configuration as intended.


## Requirements

For the sake of minimal configuration, you will need [Docker](https://www.docker.com/products/docker-desktop), this way the `Dockerfile` and `docker-compose.yml` take care of everything needed for this project.

## Spinning up

Run `docker-compose` to spin up the containers.
```shell
$ docker-compose up -d
```

Now it's time to work inside the container shell, so:
```shell
$ docker exec -it webserver bash
```
You're inside the app container, congratulations!

Install dependencies:
```shell
$ composer install
```

We're almost there! Time for `migrations`/`seeds`:

```shell
$ php artisan migrate --seed
```

If everything went fine, you can access it at http://localhost:8000, welcome!

If the Frontend is up as well, you can you can sign in with the credentials below `=)`
```
email: luiz@sampler.io
password: Password0
```
> Note: "`Password0`" is the default password for all seeded users!

## API Docs

The API documentation is based on Swagger/OpenAPI Specification, using doctrine annotations.

To access it, just navigate to http://localhost:8000/api/documentation, there you can try out all the endpoints, neat!

## Database

This projects uses a PostgreSQL container, you can access it with this host: `localhost:5432`, after the container is up. 

The detailed credentials can be found in the [.env.dev](.env.dev) (or [.env](.env) if you finished the setup already!).
