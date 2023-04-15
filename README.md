```
            _____        __ _       _ _                                      _
           |_   _|      / _(_)     (_) |             /\                     | |
             | |  _ __ | |_ _ _ __  _| |_ _   _     /  \   _ __ ___ __ _  __| | ___
             | | | '_ \|  _| | '_ \| | __| | | |   / /\ \ | '__/ __/ _` |/ _` |/ _ \
            _| |_| | | | | | | | | | | |_| |_| |  / ____ \| | | (_| (_| | (_| |  __/
           |_____|_| |_|_| |_|_| |_|_|\__|\__, | /_/    \_\_|  \___\__,_|\__,_|\___|
                                           __/ |
                                          |___/

                                       Play Anything
```

# Infinity Arcade

Infinity Arcade is a game that can create any game. It uses GPT-4 to create
interactive text games based on the users prompts. It also calls Stable
Diffusion to generate game art. It's open source and can be installed on your
computer (mac, windows, linux) or played at
[https://infinityarcade.com](https://infinityarcade.com).

## Features

-   Uses GPT-4 and AI to create any game text-based game
-   Uses Stable Diffusion to generate game art
-   Open source

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

### Prerequisites

To run InfinityArcade locally, you'll need:

-   Node.js
-   PostgreSQL
-   OpenAI API key
-   Replicate API key

### Installing

1. Clone the repository:

```
git clone https://github.com/username/InfinityArcade.git
cd InfinityArcade
```

2. Create a `.env` file in the root directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_KEY=your_replicate_api_key
DATABASE_URI=postgres://username:password@localhost:5432/infinityarcade
DEBUG=ia:*
PORT=3000
NODE_ENV=development
MODEL=gpt-4
```

3. Install dependencies:

```
npm install
```

4. Run the project in development mode:

```
npm run dev
```

The application will now be running at `http://localhost:3000`.

## Contributing

To contribute to the project, please create a pull request.

## Demo

A live demo is available at
[https://infinityarcade.com](https://infinityarcade.com).

## Authors

-   The Maximalist - [hello@themaximalist.com](mailto:hello@themaximalist.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
