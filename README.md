<<<<<<< HEAD

# Traços Server
Project containing the Traços server.

Traços is a project that aims to give more visibility to tattoo artists. This is a project created with [FastAPI](https://fastapi.tiangolo.com/).

## Links
+ [Mockup]()
+ [Documentation](https://drive.google.com/drive/folders/1RIkaG9tr3MUFPjsY2Bi3DlVSgBk0n8Lz?usp=sharing)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
First, ensure you have Python 3.7 or higher installed on your machine. You can download the latest version of Python from the official [website](https://www.python.org/downloads/).

It’s a good practice to use a virtual environment to manage your project’s dependencies. You can use venv (included with Python) or virtualenv. Here's how to create a virtual environment using venv:

1. Step 1: Install a virtual environment tool
```bash
    # Create a virtual environment named ".venv"
    python -m venv .venv

    # Activate the virtual environment
    # On Windows:
    .venv\Scripts\activate
    # On macOS and Linux:
    source .venv/bin/activate
```

2. Step2: Install FastAPI and Uvicorn.

FastAPI needs an ASGI server to run, and Uvicorn is a popular choice. You can install both FastAPI and Uvicorn using pip:

```bash
    pip install fastapi uvicorn
```

### Installing
To run the project for the **first** time you must follow this steps:

1. Clone the GitHub repository
```bash
git clone git@github.com:labprogsam/backend-tracos.git
```

2. Install the dependencies
```bash
pip install -r requirements.txt
```

3. Create **.env** file and copy the following content to it

```dotenv
# Application settings

PORT = 8000

```

## Running the project
To run the project (if already installed), just follow this simple command on the client directory:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- main:app refers to the app instance in your main.py file.
- --reload makes the server restart after code changes, which is useful during development.

> Open your web browser and go to http://127.0.0.1:8000. You should see a JSON response: {"Hello": "World"}.

## Built With
* **FastAPI**
* **Postgres**

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

=======
# backend-tracos
>>>>>>> main
