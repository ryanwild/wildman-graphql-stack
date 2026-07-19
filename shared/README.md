# Shared Code

This directory is not a service, instead it works as a shared library
across all services.

Each service that depends on the shared library copies the code from
the "dist" directory during the Docker build phase.

Additionally during runtime from Docker Compose, the shared library's
"dist" directory gets mounted as a volume are added via a "watch"
directive.
