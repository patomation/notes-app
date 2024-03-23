# Getting Started

Run the dev servers

```
./dev up
```
or
```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Running the prod servers

```
docker compose up
```

# Development

Adding a new nest module

```
cd api
npx nest g module note
npx nest g service note
npx nest g controller note
```
