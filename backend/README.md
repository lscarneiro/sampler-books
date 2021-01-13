## About Sampler Books

Simple API with frontend to manage Book Library

### Requirements

* Docker
* PHP >=7.2.5
* Composer

> The Dockerfile already picks from `7.4`

### Initial setup

1. Setup `.env` accordingly
1. Execute `composer install` on the root of the project directory to install the dependencies (you can do this directly from the container, no need to install `composer` on your machine)
1. You're ready to spin it up for the first time!

### Spinning up

This project uses `docker-compose` to spin up the needed environment

To give it a go, execute:
```shell
$ docker-compose up -d
``` 
> The first time it's slow to, as it takes time to download the images and setup the container.

If everything went fine, you can access it at http://localhost:8000

### API Docs

Spin up the environment then acess it here: http://localhost:8000/api/documentation