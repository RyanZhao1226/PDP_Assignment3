# Airbnb Data Handler

Airbnb Data Handler is a Node.js command-line tool designed to process Airbnb listing data from CSV files. The project follows functional programming principles and modern JavaScript (ES modules) to provide a robust and chainable API for filtering listings, computing statistics, and exporting results. It is built to run on Node.js using promise-based file operations and includes a user-friendly CLI interface.

## Setting up

For this project, you can clone the repository and run

`npm install`

You can run the program by CLI (readline UI)

`npm start` (Using "listings.csv" from the current directory)

or

`npm start "file_path"` (Accept csv file as a parameter)

## Project structure

```
project_root/
├── solution/
│   ├── AirBnBDataHandler.js
├── .gitignore                 # Manage git config
├── eslint.config.mjs           # Manage eslint config
├── LICENSE                    # Show the license
├── cli.js
├── jsdoc.json
├── listings.csv
├── package-lock.json
├── package.json
├── README.md
```

## Features

- **CSV Parsing:** Uses the `csv-parse` library to robustly parse CSV files, correctly handling fields with embedded commas, quotes, and newlines.
- **Data Filtering:** Allows filtering of Airbnb listings based on various criteria:

  - Price (minimum and maximum)
  - Number of bedrooms (minimum and maximum)
  - Review scores (minimum and maximum)
- **Statistics Computation:** Computes key statistics:

  - Total number of listings after filtering
  - Average price per bedroom
  - **Notes: For the N/A of price, bedrooms and review in listings, we handle them as false**
- **Host Rankings:** Ranking hosts based on the number of listings they have. The output handles singular/plural wording for listings correctly.
- **Results Export:** Provides an option to export computed results (including filtered listings, statistics, and host rankings) to a user-specified file(listing/listings).
- **Amenities Filtering (Creative Addition):**
  As a creative addition, the tool supports additional filtering by amenities. Users can input one or more amenities (comma-separated), and the program will filter listings to include only those that contain all specified amenities. The CLI then displays both the number of listings after filtering and detailed information for each listing if desired by user.

### Creative addition

The creative addition in this project is the extended filtering based on amenities. Not only does the tool filter by price, bedrooms, and review scores, but it also:

- Accepts a comma-separated list of amenities as input.
- Parses the `amenities` field to check for required items.
- Provides an option for the user to display detailed information of all listings that match the amenities criteria, in addition to showing the total count.

This enhancement allows users to perform more detailed searches on the Airbnb listings dataset and quickly identify listings with specific features.

## Process

The development process for Airbnb Data Handler involved the following steps and tools:

1. **Planning and Design:**

   - Defined the core requirements such as filtering criteria, statistics computation, host ranking, and exporting functionality.
   - Emphasized the use of functional programming concepts (pure functions, method chaining, and immutability).
2. **Implementation:**

   - Developed the main data handling module (`AirBnBDataHandler.js`) using ES modules.
   - Implemented the CLI interface (`cli.js`) using Node.js’s built-in `readline` module for interactive user input.
   - Used the `csv-parse` library to parse CSV data, addressing challenges such as handling embedded newlines and quoted fields.
   - Implemented additional features such as filtering by amenities and interactive options to display detailed listing information.
3. **Code Quality and Documentation:**

   - Followed ESLint and Prettier configurations for consistent code style.
   - Documented the code using JSDoc, which can be used to generate an HTML documentation file.
   - Ensured the use of promises and asynchronous file operations (`node:fs/promises`).
4. **Testing and Debugging:**

   - Tested the CLI and data processing on a sample CSV file to verify correct filtering, statistics computation, and host ranking.
   - Addressed edge cases such as missing data, fields with embedded delimiters, and ensuring correct singular/plural output for listings.
5. **Version Control and Deployment:**

   - Managed the project using Git and hosted the repository on GitHub following best practices.
   - Prepared a final submission package that includes all source code, configuration files, and documentation.

## Links

### Video

[https://www.youtube.com/watch?v=5yY9DWgJJ8c]()

## Acknowledgment

### Use of AI

[https://docs.google.com/document/d/1tf6Xt1yqh9wKKxX3rhujb9Y4rocTpaD3xS0zKbpoY4Y/edit?usp=sharing]()
