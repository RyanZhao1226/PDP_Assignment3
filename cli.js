#!/usr/bin/env node
import readline from 'readline';
import { createAirBnBDataHandler } from './solution/AirBnBDataHandler.js';

/**
 * Encapsulates the readline.question method.
 * Returns a Promise for easy use with async/await.
 *
 * @param {readline.Interface} rl - The readline interface.
 * @param {string} query - The prompt message.
 * @returns {Promise<string>} A promise that resolves with the user input.
 */
function promptQuestion(rl, query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

/**
 * Main function: handles the CLI interaction logic.
 */
async function runCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    // Get the CSV file path.
    // If not provided as a command-line argument, default to listing.csv in the current directory.
    let csvFilePath = process.argv[2];
    if (!csvFilePath) {
      console.log('CSV file path not provided. Using "listings.csv" from the current directory.');
      csvFilePath = 'listings.csv';
    }

    // Load data and create an AirBnBDataHandler instance.
    let dataHandler = await createAirBnBDataHandler(csvFilePath);
    console.log('Data loaded successfully.');

    // Get filter criteria from the user.
    const minPriceStr = await promptQuestion(rl, 'Enter minimum price (press Enter to skip): ');
    const maxPriceStr = await promptQuestion(rl, 'Enter maximum price (press Enter to skip): ');
    const minBedroomsStr = await promptQuestion(rl, 'Enter minimum bedrooms (press Enter to skip): ');
    const maxBedroomsStr = await promptQuestion(rl, 'Enter maximum bedrooms (press Enter to skip): ');
    const minReviewStr = await promptQuestion(rl, 'Enter minimum review score (press Enter to skip): ');
    const maxReviewStr = await promptQuestion(rl, 'Enter maximum review score (press Enter to skip): ');

    const criteria = {};
    if (minPriceStr) criteria.minPrice = parseFloat(minPriceStr);
    if (maxPriceStr) criteria.maxPrice = parseFloat(maxPriceStr);
    if (minBedroomsStr) criteria.minBedrooms = parseFloat(minBedroomsStr);
    if (maxBedroomsStr) criteria.maxBedrooms = parseFloat(maxBedroomsStr);
    if (minReviewStr) criteria.minReview = parseFloat(minReviewStr);
    if (maxReviewStr) criteria.maxReview = parseFloat(maxReviewStr);

    // Filter the data based on the provided criteria.
    dataHandler = dataHandler.filter(criteria);
    let filteredData = dataHandler.getData();
    console.log(`\nNumber of listings after filtering: ${filteredData.length}`);

    // Compute statistics.
    const stats = dataHandler.computeStats();
    console.log('\nStatistics:');
    console.log(`- Total listings: ${stats.count}`);
    console.log(`- Average price per bedroom: $${stats.avgPricePerBedroom.toFixed(2)}`);

    // Compute host rankings.
    const hostRankings = dataHandler.computeHostRankings();
    console.log('\nHost rankings:');
    hostRankings.forEach((host, index) => {
        const listingWord = host.count === 1 ? 'listing' : 'listings';
        console.log(`${index + 1}. ${host.host_name}: ${host.count} ${listingWord}`);
    });


    // Creative addition
    // New filter listings by required amenities.
    const amenityChoice = await promptQuestion(rl, '\nWould you like to filter by amenities? (yes/no): ');
    if (amenityChoice.toLowerCase() === 'yes' || amenityChoice.toLowerCase() === 'y') {
      const amenityInput = await promptQuestion(rl, 'Enter required amenities (comma separated): ');
      // Split input by commas, trim spaces, and filter out any empty values.
      const amenities = amenityInput.split(',').map(item => item.trim()).filter(item => item !== '');
      if (amenities.length > 0) {
        dataHandler = dataHandler.filterByAmenities(amenities);
        filteredData = dataHandler.getData();
        console.log(`\nNumber of listings after filtering by amenities: ${filteredData.length}`);
      } else {
        console.log('No valid amenities entered. Skipping this filter.');
      }
    }
    const showDetails = await promptQuestion(rl, '\nShow all filtered listing details? (yes/no): ');
    if (showDetails.toLowerCase() === 'yes' || showDetails.toLowerCase() === 'y') {
      console.log('\nDetails');
      filteredData.forEach((listing, index) => {
        console.log(`${index + 1}. ${JSON.stringify(listing)}`);
      });
    }

    // Optionally export results to a file.
    const exportChoice = await promptQuestion(rl, '\nWould you like to export the results to a file? (yes/no): ');
    if (exportChoice.toLowerCase() === 'yes' || exportChoice.toLowerCase() === 'y') {
      const exportFilePath = await promptQuestion(rl, 'Enter the export file path: ');
      const results = {
        stats,
        hostRankings,
        filteredListings: filteredData
      };
      await dataHandler.exportResults(results, exportFilePath);
      console.log(`Results exported to ${exportFilePath}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);  // The path is not a writable file.
  } finally {
    rl.close();
  }
}

runCLI();
