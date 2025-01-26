# Traços Server
Project containing the Traços server.

Traços is a project that aims to give more visibility to tattoo artists. This is a project created with [Express](https://expressjs.com/pt-br/).

## Links
+ [Mockup]()
+ [Documentation](https://drive.google.com/drive/folders/1RIkaG9tr3MUFPjsY2Bi3DlVSgBk0n8Lz?usp=sharing)

### Prerequisites

1. Run this command to download the current stable release of Docker Compose:
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2. Apply executable permissions to the binary:
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

### Installing
To run the project for the **first** time you must follow this steps:

1. Clone the GitHub repository
```bash
git clone git@github.com:labprogsam/backend-tracos.git
```

2. Create **.env** file and copy the following content to it

```dotenv
# Application settings

PORT=8001

# Database settings
DB_PORT=5432
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres

```

3. Install the dependencies, create a local database and run the migrations
```bash
npm i
```

```bash
docker-compose up -d --build
```

```bash
npm run migration
```

## Running the project
To run the project (if already installed), just follow this simple command on the client directory:

```bash
npm run dev
```

## Built With
* **Node.js**
* **Express.js**
* **Javascript**
* **PostgreSQL**

## GitHub

### Branches
The development branches can be:

+ feat
+ fix
+ refact

The name of the development branches must follow this template: `feat/branch-name`

In addition to these there are 2 stable branches:

+ dev
+ main

The dev and main branches should only be updated by pull requests.

### Commits
Must begin with the name of the branch you developed on, following the model: _“Feat(user story): rest of commit…”._

Must be simple and show briefly what you just did.

Ex: `git commit -m "Feat(32): Created user migrations and tables"`

> Read our code of conduct and find out [how to contribute](https://github.com/labprogsam/backend-tracos/blob/main/CONTRIBUTING.md)

## Development Team
* **Samuel Miranda** - *Developer / Scrum Master* -  [labprogsam](https://github.com/labprogsam)
* **Juliana Serafim** - *Developer / Designer* - [Juliana-serafim](https://github.com/Juliana-serafim)
* **Yasmin Adrieny** - *Developer / Tester / QA* - [AdrySales](https://github.com/AdrySales)
* **José Luiz** - *Developer / PO* - [jldsn](https://github.com/jldsn)
