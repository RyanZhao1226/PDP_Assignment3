import { readFile, writeFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

/**
 * @param {string} dataStr - The CSV file content as a string.
 * @returns {Array<Object>} An array of parsed data objects
 */
function parseCSV(dataStr) {
    const listings = parse(dataStr, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    });
    return listings;
  }  

/**
 * Internal factory function that creates an AirBnBDataHandler instance.
 * This instance supports method chaining.
 *
 * @param {Array<Object>} listings - Array of listing objects.
 * @returns {Object} An AirBnBDataHandler instance with data methods.
 */
function createAirBnBDataHandlerInstance(listings) {
  const data = listings.slice(); // Copy the data from listings.

  return {
    /**
     * Filters listings based on specified criteria.
     *
     * @param {Object} criteria - The filter criteria.
     * @param {number} [criteria.minPrice] - Minimum price.
     * @param {number} [criteria.maxPrice] - Maximum price.
     * @param {number} [criteria.minBedrooms] - Minimum number of bedrooms.
     * @param {number} [criteria.maxBedrooms] - Maximum number of bedrooms.
     * @param {number} [criteria.minReview] - Minimum review score.
     * @param {number} [criteria.maxReview] - Maximum review score.
     * @returns {Object} A new AirBnBDataHandler instance with filtered data.
     */
    filter(criteria) {
      const filtered = data.filter(listing => {
        let price = parseFloat(listing.price.replace(/[^0-9.]/g, ''));
        if (isNaN(price)) return false;  // Handle N/A as false
        let bedrooms = parseFloat(listing.bedrooms);
        if (isNaN(bedrooms)) return false;  // Handle N/A as false
        let review = parseFloat(listing.review_scores_rating);
        if (isNaN(review)) return false;  // Handle N/A as false
        if (criteria.minPrice !== undefined && price < criteria.minPrice) return false;
        if (criteria.maxPrice !== undefined && price > criteria.maxPrice) return false;
        if (criteria.minBedrooms !== undefined && bedrooms < criteria.minBedrooms) return false;
        if (criteria.maxBedrooms !== undefined && bedrooms > criteria.maxBedrooms) return false;
        if (criteria.minReview !== undefined && review < criteria.minReview) return false;
        if (criteria.maxReview !== undefined && review > criteria.maxReview) return false;
        return true;
      });
      return createAirBnBDataHandlerInstance(filtered);
    },

    /**
     * Further filters listings by required amenities.
     * @param {Array<string>} amenities - Array of required amenities.
     * @returns {Object} A new AirBnBDataHandler instance with listings that include all specified amenities.
     */
    filterByAmenities(amenities) {
      const filtered = data.filter(listing => {
        let listingAmenities;
        try {
          listingAmenities = JSON.parse(listing.amenities);
        } catch (error) {
          listingAmenities = listing.amenities;
        }
        if (!Array.isArray(listingAmenities)) {
            if (typeof listingAmenities === 'string') {
              listingAmenities = listingAmenities
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');  // Method chaining
            } else {
              listingAmenities = [];
            }
          }
        // Determine whether the current listing contains all specified amenity
        return amenities.every(amenity => listingAmenities.includes(amenity));
      });
      return createAirBnBDataHandlerInstance(filtered);
    },

    /**
     * Computes statistics: total number of listings and the average price per bedroom.
     *
     * @returns {Object} An object with properties { count, avgPricePerBedroom }.
     */
    computeStats() {
      const count = data.length;
      const { totalPrice, totalBedrooms } = data.reduce((acc, listing) => {
        let price = parseFloat(listing.price.replace(/[^0-9.]/g, ''));
        if (isNaN(price)) price = 0;
        let bedrooms = parseFloat(listing.bedrooms);
        if (isNaN(bedrooms) || bedrooms === 0) bedrooms = 1; // avoid division by 0
        acc.totalPrice += price;
        acc.totalBedrooms += bedrooms;
        return acc;
      }, { totalPrice: 0, totalBedrooms: 0 });
      const avgPricePerBedroom = totalBedrooms > 0 ? totalPrice / totalBedrooms : 0;
      return { count, avgPricePerBedroom };
    },

    /**
     * Computes host rankings by counting the number of listings per host, sorted in descending order.
     *
     * @returns {Array<Object>} An array of objects with { host_name, count }.
     */
    computeHostRankings() {
      const hostMap = data.reduce((acc, listing) => {
        const hostName = listing.host_name || 'Unknown';
        acc[hostName] = (acc[hostName] || 0) + 1;
        return acc;
      }, {});
      const ranking = Object.entries(hostMap)
        .map(([host_name, count]) => ({ host_name, count }))
        .sort((a, b) => b.count - a.count);
      return ranking;
    },

    /**
     * Exports the results to a specified file.
     *
     * @param {Object|string} results - The results object or string to export.
     * @param {string} filePath - The path of the file to export the results.
     * @returns {Promise<void>} A promise that resolves when the export is complete.
     */
    async exportResults(results, filePath) {
      const output = typeof results === 'object' ? JSON.stringify(results, null, 2) : results;
      await writeFile(filePath, output, 'utf8');
    },

    /**
     * Retrieves the current listings data.
     *
     * @returns {Array<Object>} The current array of listing objects.
     */
    getData() {
      return data;
    }
  };
}

/**
 * Loads the CSV file from the specified path and creates an AirBnBDataHandler instance.
 *
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Object>} A promise that resolves to an AirBnBDataHandler instance.
 */
export async function createAirBnBDataHandler(filePath) {
  try {
    const fileContent = await readFile(filePath, 'utf8');
    const listings = parseCSV(fileContent);
    return createAirBnBDataHandlerInstance(listings);
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    throw error;
  }
}

/**
 * Counterexample: an impure function that violates pure function principles by modifying a global variable.
 *
 * @param {Object} listing - An Airbnb listing object.
 * @returns {number} The adjusted price.
 */
let globalDiscount = 0;
export function impureAdjustPrice(listing) {
  // Impure behavior: modifying the globalDiscount variable on each call
  globalDiscount += 5;
  let price = parseFloat(listing.price.replace(/[^0-9.]/g, ''));
  if (isNaN(price)) price = 0;
  return price - globalDiscount;
}

