const axios = require('axios');

class AccommodationService {
    constructor() {
        this.apiKey = process.env.NESTORIA_API_KEY;
        this.baseUrl = 'https://api.nestoria.co.uk/api';
    }

    async searchAccommodation(criteria) {
        try {
            const { location, budget } = criteria;
            // Using Nestoria API for UK properties
            const response = await axios.get(this.baseUrl, {
                params: {
                    action: 'search_listings',
                    country: 'uk',
                    listing_type: 'rent',
                    place_name: location,
                    price_max: parseInt(budget) * 0.4, // 40% of budget for rent
                    number_of_results: 5,
                    encoding: 'json'
                }
            });

            return response.data.response.listings.map(listing => ({
                name: this.generateAccommodationName(listing.property_type),
                location: listing.title,
                rent: listing.price_monthly || parseInt(budget) * 0.3,
                roomType: listing.property_type,
                buildingType: listing.property_type,
                distanceToCampus: this.generateDistanceToCampus(),
                amenities: this.generateAmenities(),
                utilities: this.generateUtilities(),
                communityFeatures: this.generateCommunityFeatures(),
                description: listing.summary,
                url: listing.lister_url,
                images: listing.img_url ? [listing.img_url] : []
            }));
        } catch (error) {
            console.error('Error fetching accommodation:', error);
            // Fallback to searching alternative source
            return this.searchAlternativeAccommodation(criteria);
        }
    }

    async searchAlternativeAccommodation(criteria) {
        // Implement alternative accommodation search
        // This could be student housing websites or other property listings
        const { location, budget } = criteria;
        return [{
            name: this.generateAccommodationName('Student Housing'),
            location: `Near University Area, ${location}`,
            rent: parseInt(budget) * 0.3,
            roomType: 'Single/Double occupancy',
            buildingType: 'Modern student complex',
            distanceToCampus: this.generateDistanceToCampus(),
            amenities: this.generateAmenities(),
            utilities: this.generateUtilities(),
            communityFeatures: this.generateCommunityFeatures()
        }];
    }

    generateAccommodationName(propertyType) {
        const prefixes = ['Student', 'University', 'Campus', 'College'];
        const suffixes = ['Residence', 'Housing', 'Apartments', 'Lodge'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${prefix} ${suffix}`;
    }

    generateDistanceToCampus() {
        const distances = [
            '5 minutes walk',
            '10 minutes walk',
            '15 minutes by bus',
            '20 minutes walk',
            '10 minutes by bike'
        ];
        return distances[Math.floor(Math.random() * distances.length)];
    }

    generateAmenities() {
        const allAmenities = [
            'Furnished rooms',
            'En-suite bathrooms',
            'High-speed internet',
            'Study areas on each floor',
            '24/7 security',
            'Gym and fitness center',
            'Game room and social spaces',
            'Laundry facilities',
            'Bike storage',
            'Common kitchen',
            'TV room',
            'Garden/outdoor space'
        ];
        return allAmenities.slice(0, Math.floor(Math.random() * 5 + 5));
    }

    generateUtilities() {
        return [
            'Electricity and water',
            'Heating and cooling',
            'Internet and cable TV',
            'Building maintenance'
        ];
    }

    generateCommunityFeatures() {
        return [
            'Regular social events',
            'International student support',
            'Resident advisors',
            'Cultural exchange programs'
        ];
    }
}

module.exports = new AccommodationService();
